import { renderPage } from './src/functions/renderPage'
import { processCronTrigger } from './src/functions/cronTrigger'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the generic "Internal Error" text.
 *
 * Static files (style.css, client.js, images) are served from ./out by Workers
 * Static Assets before this Worker runs, see [assets] in wrangler.toml.
 */
const DEBUG = false

// The rendered page is kept in the edge cache for 5 seconds, like the previous
// flareact `revalidate: 5`, so page views do not each read KV. The Cache API is
// functional on custom domains/routes (developers.cloudflare.com/workers/
// runtime-apis/cache, read 2026-10-27) and only accepts GET requests.
const pageCacheControl = 'max-age=5'

export default {
  async fetch(request, env, ctx) {
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

    const useCache = !DEBUG && request.method === 'GET'

    try {
      if (useCache) {
        const cachedResponse = await caches.default.match(request)
        if (cachedResponse) {
          return cachedResponse
        }
      }

      const response = new Response(await renderPage(env), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': pageCacheControl,
        },
      })

      if (useCache) {
        ctx.waitUntil(caches.default.put(request, response.clone()))
      }

      return response
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
