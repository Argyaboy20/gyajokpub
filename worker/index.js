// Menyajikan foto dari bucket R2 lewat alamat situs sendiri: /foto/<folder>/<uuid>.webp
const POLA_KUNCI = /^(track-record|pricelist)\/[0-9a-f-]{36}\.webp$/

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
    }

    const url = new URL(request.url)
    const kunci = url.pathname.slice('/foto/'.length)
    if (!POLA_KUNCI.test(kunci)) return new Response('Not Found', { status: 404 })

    const objek = await env.FOTO.get(kunci, { onlyIf: request.headers })
    if (objek === null) return new Response('Not Found', { status: 404 })

    const headers = new Headers()
    objek.writeHttpMetadata(headers)
    headers.set('etag', objek.httpEtag)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('X-Content-Type-Options', 'nosniff')

    // objek.body kosong = kondisi If-None-Match terpenuhi (foto tidak berubah)
    const status = objek.body ? 200 : 304
    return new Response(request.method === 'HEAD' ? null : objek.body, { status, headers })
  },

  async scheduled(_event, _env, ctx) {
    ctx.waitUntil(
      fetch('https://gyajokpub-api.onrender.com/api/ping', { signal: AbortSignal.timeout(60000) }).catch(() => {}),
    )
  },
}