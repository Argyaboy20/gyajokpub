<script setup>
import { computed, ref } from 'vue'
import { Search, LoaderCircle, CircleAlert, Check, ExternalLink, ZoomIn } from 'lucide-vue-next'
import { http } from '@/api/http'

const emit = defineEmits(['bukti'])

const LANGKAH = [
  { nilai: 'SUBMIT', label: 'Submit' },
  { nilai: 'REVIEW', label: 'Review' },
  { nilai: 'LOA', label: 'LoA' },
  { nilai: 'SELESAI', label: 'Selesai' },
]

const nomor = ref('')
const hasil = ref(null)
const error = ref('')
const memuat = ref(false)

const indeks = computed(() => LANGKAH.findIndex((l) => l.nilai === hasil.value?.status))
const labelStatus = computed(() => LANGKAH[indeks.value]?.label ?? '')

// Link dicek ulang di browser: hanya https yang dijadikan tautan
const linkAman = computed(() => {
  try {
    return new URL(hasil.value?.linkJurnal).protocol === 'https:'
  } catch {
    return false
  }
})

const tanggal = computed(() => {
  const d = new Date(hasil.value?.diperbarui)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})

async function cari() {
  const n = nomor.value.trim().toUpperCase()
  if (!n || memuat.value) return
  memuat.value = true
  error.value = ''
  hasil.value = null
  try {
    hasil.value = await http(`/api/public/lacak/${encodeURIComponent(n)}`)
  } catch (e) {
    error.value = e.message
  } finally {
    memuat.value = false
  }
}
</script>

<template>
  <div class="lacak">
    <p class="intro">Masukkan nomor pesanan dari GyaJokPub untuk melihat perkembangan naskahmu.</p>

    <form class="cari" role="search" @submit.prevent="cari">
      <label for="nomor-pesanan" class="sr">Nomor pesanan</label>
      <div class="kolom">
        <Search class="ikon" :size="18" aria-hidden="true" />
        <input
          id="nomor-pesanan"
          v-model="nomor"
          type="text"
          inputmode="text"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          maxlength="30"
          placeholder="Contoh: GJP-261114-7K3M9Q"
        />
      </div>
      <button type="submit" :disabled="memuat || !nomor.trim()">
        <LoaderCircle v-if="memuat" class="putar" :size="18" aria-hidden="true" />
        {{ memuat ? 'Mencari…' : 'Lacak' }}
      </button>
    </form>

    <p v-if="error" class="galat" role="alert">
      <CircleAlert :size="18" aria-hidden="true" />
      <span>{{ error }}</span>
    </p>

    <article v-if="hasil" class="hasil" aria-live="polite">
      <header class="kepala">
        <code>{{ hasil.nomor }}</code>
        <span class="badge" :data-status="hasil.status">{{ labelStatus }}</span>
      </header>

      <ol class="langkah" aria-label="Tahapan naskah">
        <li
          v-for="(l, i) in LANGKAH"
          :key="l.nilai"
          :class="{ capai: i <= indeks, sekarang: i === indeks }"
          :aria-current="i === indeks ? 'step' : undefined"
        >
          <span class="bulat"><Check v-if="i <= indeks" :size="14" aria-hidden="true" /></span>
          <span class="nama">{{ l.label }}</span>
        </li>
      </ol>

      <dl class="rincian">
        <div>
          <dt>Nama Pesanan</dt>
          <dd>{{ hasil.nama }}</dd>
        </div>
        <div>
          <dt>Judul Naskah</dt>
          <dd>{{ hasil.judul }}</dd>
        </div>
        <div>
          <dt>Tujuan Rumah Jurnal</dt>
          <dd>{{ hasil.tujuan }}</dd>
        </div>
        <div>
          <dt>Link Rumah Jurnal</dt>
          <dd>
            <a
              v-if="hasil.linkJurnal && linkAman"
              :href="hasil.linkJurnal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buka rumah jurnal <ExternalLink :size="14" aria-hidden="true" />
            </a>
            <span v-else class="kosong">Belum tersedia</span>
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{{ labelStatus }}</dd>
        </div>
      </dl>

      <div class="bukti">
        <span class="judul-bukti">Bukti</span>
        <button
          v-if="hasil.buktiUrl"
          type="button"
          class="foto"
          @click="emit('bukti', hasil.buktiUrl)"
        >
          <img :src="hasil.buktiUrl" alt="Bukti status naskah" loading="lazy" />
          <span class="zoom"><ZoomIn :size="16" aria-hidden="true" /> Perbesar</span>
        </button>
        <span v-else class="kosong">Belum ada bukti</span>
      </div>

      <small v-if="tanggal" class="waktu">Diperbarui {{ tanggal }}</small>
    </article>
  </div>
</template>

<style scoped>
/* Mobile (<641px) = default */
.lacak {
  display: grid;
  gap: 1rem;
}
.intro {
  margin: 0;
  color: var(--redup);
}
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.cari {
  display: grid;
  gap: 0.6rem;
}
.kolom {
  position: relative;
  display: flex;
  align-items: center;
}
.ikon {
  position: absolute;
  left: 0.85rem;
  color: var(--redup);
  pointer-events: none;
}
input {
  width: 100%;
  min-width: 0;
  height: 48px;
  padding: 0 0.9rem 0 2.6rem;
  border: 1px solid #c4d2de;
  border-radius: 12px;
  background: #fff;
  color: var(--tinta);
  font-size: 1rem; /* 16px agar iOS tidak memperbesar layar */
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
input::placeholder {
  color: #8a98ab;
  text-transform: none;
  letter-spacing: 0;
}
input:focus {
  border-color: var(--aksen);
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
}
.cari button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 48px;
  padding: 0 1.5rem;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px -10px rgba(11, 36, 71, 0.6);
}
.cari button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.putar {
  animation: putar 0.8s linear infinite;
}
@keyframes putar {
  to {
    transform: rotate(360deg);
  }
}

.galat {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0;
  padding: 0.7rem 0.85rem;
  border: 1px solid #f3c1bd;
  border-radius: 10px;
  background: #fdecea;
  color: #8c1d18;
  font-size: 0.95rem;
}
.galat svg {
  flex: none;
  margin-top: 0.12rem;
}

.hasil {
  display: grid;
  gap: 1.1rem;
  padding: 1rem;
  border: 1px solid var(--garis);
  border-radius: 16px;
  background: var(--kertas);
}
.kepala {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
code {
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  background: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  overflow-wrap: anywhere;
}
.badge {
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  background: var(--teal-100);
  color: var(--aksen-tua);
  font-size: 0.8rem;
  font-weight: 700;
}
.badge[data-status='SELESAI'] {
  background: #dff3e8;
  color: var(--ok);
}

.langkah {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}
.langkah li {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  text-align: center;
}
.langkah li:not(:first-child)::before {
  content: '';
  position: absolute;
  top: 13px;
  right: 50%;
  width: 100%;
  height: 3px;
  background: #cfdbe5;
}
.langkah li.capai:not(:first-child)::before {
  background: var(--aksen);
}
.bulat {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 2px solid #cfdbe5;
  border-radius: 50%;
  background: #fff;
  color: #fff;
}
.langkah li.capai .bulat {
  border-color: var(--aksen);
  background: var(--aksen);
}
.langkah li.sekarang .bulat {
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.22);
}
.nama {
  color: var(--redup);
  font-size: 0.78rem;
  font-weight: 600;
}
.langkah li.capai .nama {
  color: var(--tinta);
}

.rincian {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}
.rincian dt {
  color: var(--redup);
  font-size: 0.8rem;
  font-weight: 600;
}
.rincian dd {
  margin: 0.1rem 0 0;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.rincian a {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--aksen-tua);
}
.kosong {
  color: #8a98ab;
  font-style: italic;
  font-weight: 400;
}

.bukti {
  display: grid;
  justify-items: start;
  gap: 0.4rem;
}
.judul-bukti {
  color: var(--redup);
  font-size: 0.8rem;
  font-weight: 600;
}
.foto {
  position: relative;
  display: block;
  width: 100%;
  max-width: 280px;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--garis);
  border-radius: 12px;
  background: #fff;
  cursor: zoom-in;
}
.foto img {
  display: block;
  width: 100%;
}
.zoom {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(11, 36, 71, 0.82);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
}
.waktu {
  color: var(--redup);
}

/* Tablet */
@media (min-width: 641px) {
  .cari {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .hasil {
    padding: 1.4rem;
  }
  .nama {
    font-size: 0.85rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .hasil {
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 1.5rem;
    padding: 1.75rem;
  }
  .kepala,
  .langkah,
  .waktu {
    grid-column: 1 / -1;
  }
  .rincian {
    grid-column: 1;
  }
  .bukti {
    grid-column: 2;
    align-content: start;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .hasil {
    grid-template-columns: minmax(0, 1fr) 320px;
    padding: 2rem;
  }
  .foto {
    max-width: 320px;
  }
}
</style>
