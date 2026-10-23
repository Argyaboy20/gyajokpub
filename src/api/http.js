const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

let ambilToken = () => null
let saatTidakSah = () => {}

export function pasangAuth({ token, tidakSah }) {
  ambilToken = token
  saatTidakSah = tidakSah
}

export async function http(path, { method = 'GET', body, form, auth = false } = {}) {
  const headers = {}
  if (auth) {
    const t = ambilToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }

  let payload
  if (form) {
    payload = form // FormData: browser mengatur Content-Type sendiri
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: payload })
  } catch {
    throw new ApiError(0, 'Tidak dapat terhubung ke server')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    /* respons tanpa JSON */
  }

  if (!res.ok) {
    if (res.status === 401 && auth) saatTidakSah() // token ditolak: paksa keluar
    throw new ApiError(res.status, data?.message ?? 'Terjadi kesalahan')
  }
  if (data === null) throw new ApiError(res.status, 'Respons server tidak valid')
  return data
}