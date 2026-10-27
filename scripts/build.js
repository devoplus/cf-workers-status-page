// Prepares everything the Worker needs before `wrangler dev` / `wrangler deploy`
// (wired as [build] command in wrangler.toml through `yarn build`):
// 1. config.yaml -> generated/config.json (imported by Worker and browser code)
// 2. public/* -> out/ (served by Workers Static Assets)
// 3. src/client.js -> out/client.js (browser bundle that hydrates the page)
// out/style.css is compiled afterwards by `yarn css` (Tailwind CLI).
const fs = require('fs')
const path = require('path')
const esbuild = require('esbuild')
const YAML = require('yaml')

const root = path.resolve(__dirname, '..')
const publicDir = path.join(root, 'public')
const outDir = path.join(root, 'out')
const generatedDir = path.join(root, 'generated')

// Tailwind source and the legacy v2 build output are not served as-is
const skipPublicFiles = new Set(['tailwind.css', 'style.css'])

function writeConfig() {
  const config = YAML.parse(
    fs.readFileSync(path.join(root, 'config.yaml'), 'utf8'),
  )
  fs.mkdirSync(generatedDir, { recursive: true })
  fs.writeFileSync(
    path.join(generatedDir, 'config.json'),
    JSON.stringify(config, null, 2),
  )
}

function copyPublicFiles() {
  for (const entry of fs.readdirSync(outDir)) {
    if (entry !== '.gitkeep') {
      fs.rmSync(path.join(outDir, entry), { recursive: true, force: true })
    }
  }
  for (const entry of fs.readdirSync(publicDir)) {
    if (!skipPublicFiles.has(entry)) {
      fs.cpSync(path.join(publicDir, entry), path.join(outDir, entry), {
        recursive: true,
      })
    }
  }
}

async function buildClient() {
  await esbuild.build({
    entryPoints: [path.join(root, 'src', 'client.js')],
    outfile: path.join(outDir, 'client.js'),
    bundle: true,
    minify: true,
    format: 'esm',
    target: 'es2020',
    jsx: 'automatic',
    loader: { '.js': 'jsx' },
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production',
      ),
    },
    logLevel: 'warning',
  })
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })
  writeConfig()
  copyPublicFiles()
  await buildClient()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
