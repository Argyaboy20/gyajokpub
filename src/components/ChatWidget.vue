<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { X, Send, MessageCircle } from 'lucide-vue-next'
import { http } from '@/api/http'

const SAPAAN = 'Halo! Ada yang bisa kami bantu?'
const RIWAYAT_MAKS = 10
const JEDA_SAPAAN = 1000 // ms ruang kosong sebelum sapaan muncul

const buka = ref(false)
const input = ref('')
const mengirim = ref(false)
const pesan = ref([])
const daftar = ref(null)
const kolom = ref(null)
let nomor = 0
let timerSapaan = null
let sapaanSudah = false
const diperluas = ref(true) // pil bertuliskan teks tampil dulu, lalu mengecil jadi ikon
let timerPil = null

const layarPonsel = () => window.matchMedia('(max-width: 640px)').matches
const kurangiGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function gulir() {
  nextTick(() => {
    const el = daftar.value
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: kurangiGerak() ? 'auto' : 'smooth' })
  })
}

// Di layar ponsel panel menutupi halaman, jadi gulir halaman dikunci
function kunciHalaman(kunci) {
  document.body.style.overflow = kunci && layarPonsel() ? 'hidden' : ''
}

function tampilkanSapaan() {
  pesan.value.push({ id: nomor++, dari: 'bot', teks: SAPAAN, riwayat: false })
  gulir()
}

watch(buka, async (b) => {
  kunciHalaman(b)
  if (!b) return
  // Pertama kali dibuka: ruang chat kosong dulu, sapaan muncul setelah 1 detik
  if (!sapaanSudah) {
    sapaanSudah = true
    timerSapaan = setTimeout(tampilkanSapaan, JEDA_SAPAAN)
  }
  await nextTick()
  if (!layarPonsel()) kolom.value?.focus() // di ponsel jangan langsung memunculkan keyboard
  gulir()
})

onMounted(() => {
  timerPil = setTimeout(() => (diperluas.value = false), 4000)
})

onUnmounted(() => {
  clearTimeout(timerPil)
  clearTimeout(timerSapaan)
  kunciHalaman(false)
})

async function kirim() {
  const teks = input.value.trim()
  if (!teks || mengirim.value) return

  clearTimeout(timerSapaan) // pengunjung sudah bicara duluan: sapaan dibatalkan
  sapaanSudah = true

  // Sapaan awal dan pesan galat tidak ikut dikirim sebagai riwayat
  const riwayat = pesan.value
    .filter((p) => p.riwayat)
    .slice(-RIWAYAT_MAKS)
    .map((p) => ({ dari: p.dari, teks: p.teks.slice(0, 600) }))

  pesan.value.push({ id: nomor++, dari: 'user', teks, riwayat: true })
  input.value = ''
  mengirim.value = true
  gulir()

  try {
    const r = await http('/api/chat', { method: 'POST', body: { pesan: teks, riwayat } })
    pesan.value.push({ id: nomor++, dari: 'bot', teks: r.jawaban, riwayat: true })
  } catch (e) {
    pesan.value.push({ id: nomor++, dari: 'bot', teks: e.message, riwayat: false })
  } finally {
    mengirim.value = false
    gulir()
    nextTick(() => {
      if (!layarPonsel()) kolom.value?.focus()
    })
  }
}
</script>

<template>
  <div class="chat">
    <Transition name="panel">
      <section v-if="buka" class="panel" role="dialog" aria-label="Asisten GyaJokPub" @keydown.esc="buka = false">
        <header class="kepala">
          <h2>Asisten GyaJokPub</h2>
          <button type="button" class="tutup" aria-label="Tutup chat" @click="buka = false">
            <X :size="20" />
          </button>
        </header>

        <div ref="daftar" class="isi" role="log" aria-live="polite">
          <TransitionGroup name="pop" tag="div" class="susunan">
            <p v-for="p in pesan" :key="p.id" class="gelembung" :class="p.dari">{{ p.teks }}</p>
            <p v-if="mengirim" key="mengetik" class="gelembung bot mengetik">Sedang mengetik…</p>
          </TransitionGroup>
        </div>

        <form class="isian" @submit.prevent="kirim">
          <input
            ref="kolom"
            v-model="input"
            type="text"
            maxlength="300"
            placeholder="Tulis pertanyaanmu…"
            aria-label="Pertanyaan"
            autocomplete="off"
          />
          <button type="submit" :disabled="mengirim || !input.trim()" aria-label="Kirim">
            <Send :size="18" />
          </button>
        </form>

        <p class="catatan">Dijawab oleh asisten AI dan bisa keliru. Untuk harga pasti, tanya admin lewat kontak.</p>
      </section>
    </Transition>

    <Transition name="pil">
        <button
            v-if="!buka"
            type="button"
            class="pemicu"
            :class="{ lebar: diperluas }"
            aria-label="Buka chat asisten"
            @click="buka = true"
        >
            <MessageCircle :size="26" aria-hidden="true" />
            <span class="teks" aria-hidden="true">Mau nanya nanya dulu? Ke sini aja yuk</span>
        </button>
    </Transition>
  </div>
</template>

<style scoped>
/* Mobile (<641px) = default: layar penuh */
.pemicu {
  position: fixed;
  right: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  z-index: 50;
  display: inline-flex;
  align-items: center;
  height: 56px;
  padding: 0 15px; /* 15 + ikon 26 + 15 = lingkaran 56px saat mengecil */
  border: 0;
  border-radius: 999px;
  background: var(--aksen, #0b6e72);
  color: #fff;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(22, 35, 59, 0.35);
  transition:
    background-color 0.4s ease,
    padding 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.pemicu.lebar {
  padding-right: 1.3rem;
  background: var(--tinta, #16233b);
}
.pemicu:focus-visible {
  outline: 3px solid var(--tinta, #16233b);
  outline-offset: 3px;
}

.teks {
  max-width: 0;
  margin-left: 0;
  overflow: hidden;
  opacity: 0;
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 700;
  transition:
    max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease;
}
.pemicu.lebar .teks {
  max-width: min(300px, calc(100vw - 7.5rem));
  margin-left: 0.6rem;
  opacity: 1;
}

.panel {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background: var(--kertas, #f5f7fa);
  transform-origin: 100% 100%;
}
.kepala {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: none;
  padding: calc(0.75rem + env(safe-area-inset-top, 0px)) 1rem 0.75rem;
  background: var(--tinta, #16233b);
  color: #fff;
}
.kepala h2 {
  margin: 0;
  font-size: 1.05rem;
}
.tutup {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
}
.tutup:focus-visible {
  outline: 2px solid #fff;
}

.isi {
  flex: 1;
  min-height: 0;
  padding: 0.75rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.susunan {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.gelembung {
  max-width: 82%;
  margin: 0;
  padding: 0.6rem 0.85rem;
  font-size: 0.95rem;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.gelembung.bot {
  align-self: flex-start;
  border: 1px solid var(--garis, #d9dfe7);
  border-radius: 14px 14px 14px 4px;
  background: #fff;
  transform-origin: 0 100%;
}
.gelembung.user {
  align-self: flex-end;
  border-radius: 14px 14px 4px 14px;
  background: var(--aksen, #0b6e72);
  color: #fff;
  transform-origin: 100% 100%;
}
.mengetik {
  color: var(--redup, #4a5568);
  font-style: italic;
}

.isian {
  display: flex;
  flex: none;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border-top: 1px solid var(--garis, #d9dfe7);
  background: #fff;
}
.isian input {
  flex: 1;
  min-width: 0;
  padding: 0.7rem 0.9rem;
  border: 1px solid #bbb;
  border-radius: 999px;
  font-family: inherit;
  font-size: 1rem; /* minimal 16px agar iOS tidak memperbesar layar */
}
.isian input:focus-visible {
  outline: 2px solid var(--aksen, #0b6e72);
  border-color: transparent;
}
.isian button {
  display: grid;
  flex: none;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: var(--aksen, #0b6e72);
  color: #fff;
  cursor: pointer;
}
.isian button:disabled {
  opacity: 0.45;
  cursor: default;
}
.catatan {
  flex: none;
  margin: 0;
  padding: 0 0.9rem calc(0.6rem + env(safe-area-inset-bottom, 0px));
  background: #fff;
  color: var(--redup, #4a5568);
  font-size: 0.75rem;
  line-height: 1.35;
}

/* Animasi: panel membuka */
.panel-enter-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.panel-leave-active {
  transition:
    opacity 0.15s ease-in,
    transform 0.2s ease-in;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.96);
}

/* Animasi: gelembung masuk, memantul seperti WhatsApp */
.pop-enter-active {
  transition:
    opacity 0.18s ease-out,
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from {
  opacity: 0;
  transform: scale(0.5) translateY(10px);
}

/* Animasi: pil pemicu muncul/hilang */
.pil-enter-active,
.pil-leave-active {
  transition: opacity 0.2s ease;
}
.pil-enter-from,
.pil-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .pemicu,
  .teks {
    transition: none;
  }
  .panel-enter-active,
  .panel-leave-active,
  .pop-enter-active,
  .pil-enter-active,
  .pil-leave-active {
    transition: none;
  }
}

/* Tablet: kartu mengambang di kanan bawah */
@media (min-width: 641px) {
  .pemicu {
    right: 1.5rem;
    bottom: 1.5rem;
  }
  .teks {
    font-size: 1rem;
  }
  .pemicu.lebar .teks {
    max-width: 340px;
  }
  .panel {
    inset: auto 1.5rem 1.5rem auto;
    width: min(360px, calc(100vw - 3rem));
    height: min(520px, calc(100dvh - 3rem));
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(22, 35, 59, 0.3);
  }
  .kepala {
    padding-top: 0.75rem;
  }
  .catatan {
    padding-bottom: 0.6rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .panel {
    width: min(380px, calc(100vw - 3rem));
    height: min(560px, calc(100dvh - 3rem));
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .pemicu {
    right: 2rem;
    bottom: 2rem;
  }
  .panel {
    inset: auto 2rem 2rem auto;
    width: min(400px, calc(100vw - 4rem));
    height: min(600px, calc(100dvh - 4rem));
  }
}
</style>