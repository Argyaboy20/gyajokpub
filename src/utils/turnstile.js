const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY
let muatSkrip = null

function muat() {
  if (muatSkrip) return muatSkrip
  muatSkrip = new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile)
      return
    }
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.onload = () => resolve(window.turnstile)
    s.onerror = () => {
      muatSkrip = null
      reject(new Error('Turnstile gagal dimuat'))
    }
    document.head.appendChild(s)
  })
  return muatSkrip
}

// Tanpa VITE_TURNSTILE_SITE_KEY semuanya mati dan token selalu ''.
// Bila widget gagal/lambat, token '' dikirim dan server yang memutuskan.
export function buatTurnstile(elemen) {
  if (!SITE_KEY || !elemen) return { ambilToken: async () => '', hancurkan() {} }

  let widgetId = null
  let token = ''
  let penunggu = []
  let gagal = false
  let hancur = false

  function bangunkan(nilai) {
    const p = penunggu
    penunggu = []
    p.forEach((r) => r(nilai))
  }

  muat()
    .then((ts) => {
      if (hancur) return
      widgetId = ts.render(elemen, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only', // tampil hanya jika perlu verifikasi manual
        callback: (t) => {
          token = t
          bangunkan(t)
        },
        'expired-callback': () => {
          token = ''
        },
        'error-callback': () => {
          token = ''
          bangunkan('')
        },
      })
    })
    .catch(() => {
      gagal = true
      bangunkan('')
    })

  // Token hanya berlaku sekali: setelah diambil, widget di-reset untuk permintaan berikutnya
  function ambilToken() {
    if (gagal) return Promise.resolve('')
    return new Promise((resolve) => {
      const siap = (t) => {
        clearTimeout(timer)
        resolve(t)
        if (t && widgetId !== null && window.turnstile) {
          token = ''
          window.turnstile.reset(widgetId)
        }
      }
      const timer = setTimeout(() => {
        penunggu = penunggu.filter((x) => x !== siap)
        resolve('')
      }, 12000)
      if (token) siap(token)
      else penunggu.push(siap)
    })
  }

  function hancurkan() {
    hancur = true
    if (widgetId !== null && window.turnstile) window.turnstile.remove(widgetId)
  }

  return { ambilToken, hancurkan }
}