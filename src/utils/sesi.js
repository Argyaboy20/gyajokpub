const KUNCI = 'gjp_sesi'

export function simpanSesi(sesi) {
  try {
    sessionStorage.setItem(KUNCI, JSON.stringify(sesi))
  } catch {
    /* penyimpanan tidak tersedia: sesi hanya di memori */
  }
}

export function bacaSesi() {
  try {
    const s = JSON.parse(sessionStorage.getItem(KUNCI))
    if (!s || typeof s.token !== 'string' || typeof s.habis !== 'number') return null
    if (s.habis <= Date.now()) {
      hapusSesi()
      return null
    }
    return s
  } catch {
    return null
  }
}

export function hapusSesi() {
  try {
    sessionStorage.removeItem(KUNCI)
  } catch {
    /* abaikan */
  }
}