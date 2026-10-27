import { renderPage } from './src/functions/renderPage'
import { processCronTrigger } from './src/functions/cronTrigger'

/**
 * The DEBUG flag will return an error message on exception in your Response
 * rather than the generic "Internal Error" text, which helps during development.
 *
 * Static files (style.css, client.js, images) are served from ./out by Workers
 * Static Assets before this Worker runs, see [assets] in wrangler.toml.
 */
const DEBUG = false

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)

    if (pathname !== '/') {
      return new Response('Not Found', { status: 404 })
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD' },
      })
    }

    try {
      return new Response(await renderPage(env), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          // same freshness as the previous edge props revalidation (5 seconds)
          'Cache-Control': 'max-age=5',
        },
      })
    } catch (e) {
      console.error(e)
      if (DEBUG) {
        return new Response(e.message || e.toString(), {
          status: 500,
        })
      }
      return new Response('Internal Error', { status: 500 })
    }
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(processCronTrigger(env, ctx))
  },
}
