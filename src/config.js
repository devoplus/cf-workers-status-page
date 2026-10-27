// config.yaml parsed to JSON by scripts/build.js, so both the Worker bundle
// (wrangler) and the browser bundle (esbuild) can import it without a YAML loader
export { default } from '../generated/config.json'
