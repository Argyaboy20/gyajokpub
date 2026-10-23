import { defineStore } from 'pinia'
import { ref } from 'vue'
import { http } from '@/api/http'

export const useKontenStore = defineStore('konten', () => {
  const data = ref({ trackRecord: [], pricelist: {}, kontak: [] })
  const memuat = ref(true)
  const lambat = ref(false) // server di hosting gratis bisa butuh waktu untuk bangun
  const error = ref('')

  async function muat() {
    memuat.value = true
    lambat.value = false
    error.value = ''
    const timer = setTimeout(() => (lambat.value = true), 4000)
    try {
      data.value = await http('/api/public/konten')
    } catch (e) {
      error.value = e.message
    } finally {
      clearTimeout(timer)
      memuat.value = false
      lambat.value = false
    }
  }

  return { data, memuat, lambat, error, muat }
})