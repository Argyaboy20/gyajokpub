import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { http } from '@/api/http'
import { simpanSesi, bacaSesi, hapusSesi } from '@/utils/sesi'

export const useAuthStore = defineStore('auth', () => {
  const awal = bacaSesi()
  const token = ref(awal?.token ?? null)
  const email = ref(awal?.email ?? '')
  const habis = ref(awal?.habis ?? 0) // ms epoch

  const masuk = computed(() => !!token.value && habis.value > Date.now())

  let timer = null

  function pasangSesi(tokenBaru, detik, emailBaru) {
    token.value = tokenBaru
    email.value = emailBaru
    habis.value = Date.now() + detik * 1000
    simpanSesi({ token: tokenBaru, email: emailBaru, habis: habis.value })
  }

  function keluar() {
    clearTimeout(timer)
    token.value = null
    email.value = ''
    habis.value = 0
    hapusSesi()
  }

  // Perpanjang 5 menit sebelum token habis
  function jadwalkanPerpanjang() {
    clearTimeout(timer)
    const tunda = Math.max(habis.value - Date.now() - 5 * 60 * 1000, 5000)
    timer = setTimeout(perpanjang, tunda)
  }

  // Token terakhir (batas 8 jam tercapai): tidak diperpanjang lagi, logout saat habis
  function jadwalkanKeluar() {
    clearTimeout(timer)
    timer = setTimeout(keluar, Math.max(habis.value - Date.now(), 0))
  }

  async function perpanjang() {
    try {
      const r = await http('/api/auth/refresh', { method: 'POST', auth: true })
      pasangSesi(r.token, r.expiresInSeconds, email.value)
      if (r.sisaBatasMutlakDetik <= r.expiresInSeconds) jadwalkanKeluar()
      else jadwalkanPerpanjang()
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        keluar()
      } else if (habis.value > Date.now()) {
        timer = setTimeout(perpanjang, 30000) // gangguan jaringan: coba lagi
      } else {
        keluar()
      }
    }
  }

  async function login(emailInput, password, kodeAkses, turnstileToken = '') {
    const r = await http('/api/auth/admin/login', {
      method: 'POST',
      body: { email: emailInput, password, kodeAkses, turnstileToken },
    })
    pasangSesi(r.token, r.expiresInSeconds, r.admin.email)
    jadwalkanPerpanjang()
  }

  return { token, email, masuk, login, perpanjang, keluar }
})