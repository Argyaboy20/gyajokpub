<script setup>
import { ref, onMounted } from 'vue'
import { ArrowUp, ArrowDown, Trash2, Pencil } from 'lucide-vue-next'
import { http } from '@/api/http'
import UploadGambar from './UploadGambar.vue'

const props = defineProps({
  judul: { type: String, required: true },
  petunjuk: { type: String, default: '' },
  daftarUrl: { type: String, required: true }, // GET + POST; urutan = daftarUrl + '/urutan'
  hapusUrl: { type: String, required: true }, // DELETE/PATCH hapusUrl/:id
  bentuk: { type: String, default: 'persegi' }, // 'bebas' (ikut foto) | 'persegi'
})

const daftar = ref([])
const memuat = ref(true)
const mengunggah = ref(false)
const pesan = ref('')
const error = ref('')

const sedangEdit = ref(null) // id foto yang keterangannya sedang diubah
const teksEdit = ref('')
const menyimpan = ref(false)

async function muat() {
  try {
    daftar.value = await http(props.daftarUrl, { auth: true })
  } catch (e) {
    error.value = e.message
  } finally {
    memuat.value = false
  }
}
onMounted(muat)

async function unggah(files) {
  error.value = ''
  pesan.value = ''
  mengunggah.value = true
  try {
    const form = new FormData()
    files.forEach((f) => form.append('foto', f))
    const r = await http(props.daftarUrl, { method: 'POST', form, auth: true })
    pesan.value = r.gagal
      ? `${r.ditambah.length} foto ditambahkan, ${r.gagal} gagal diproses`
      : `${r.ditambah.length} foto ditambahkan`
    await muat()
  } catch (e) {
    error.value = e.message
  } finally {
    mengunggah.value = false
  }
}

async function hapus(item) {
  if (!window.confirm('Hapus foto ini? Tindakan ini tidak dapat dibatalkan.')) return
  error.value = ''
  pesan.value = ''
  try {
    await http(`${props.hapusUrl}/${item.id}`, { method: 'DELETE', auth: true })
    daftar.value = daftar.value.filter((x) => x.id !== item.id)
  } catch (e) {
    error.value = e.message
  }
}

async function geser(i, arah) {
  const j = i + arah
  if (j < 0 || j >= daftar.value.length) return
  error.value = ''
  const lama = daftar.value
  const baru = [...lama]
  ;[baru[i], baru[j]] = [baru[j], baru[i]]
  daftar.value = baru
  try {
    await http(`${props.daftarUrl}/urutan`, {
      method: 'PUT',
      body: { ids: baru.map((x) => x.id) },
      auth: true,
    })
  } catch (e) {
    daftar.value = lama
    error.value = e.message
  }
}

function mulaiEdit(item) {
  error.value = ''
  pesan.value = ''
  sedangEdit.value = item.id
  teksEdit.value = item.keterangan ?? ''
}

async function simpanKeterangan(item) {
  if (menyimpan.value) return
  menyimpan.value = true
  error.value = ''
  try {
    const r = await http(`${props.hapusUrl}/${item.id}`, {
      method: 'PATCH',
      body: { keterangan: teksEdit.value },
      auth: true,
    })
    item.keterangan = r.keterangan
    sedangEdit.value = null
    pesan.value = 'Keterangan disimpan'
  } catch (e) {
    error.value = e.message
  } finally {
    menyimpan.value = false
  }
}
</script>

<template>
  <section>
    <header class="kepala">
      <div>
        <h2>{{ judul }}</h2>
        <p v-if="petunjuk" class="petunjuk">{{ petunjuk }}</p>
      </div>
      <span v-if="!memuat" class="jumlah">{{ daftar.length }} foto</span>
    </header>

    <UploadGambar :memuat="mengunggah" @pilih="unggah" />

    <p v-if="pesan" class="ok" role="status">{{ pesan }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <p v-if="memuat" class="info">Memuat…</p>
    <p v-else-if="!daftar.length" class="info">Belum ada foto.</p>

    <ul v-else class="grid">
      <li v-for="(item, i) in daftar" :key="item.id" class="kartu" :class="{ mengubah: sedangEdit === item.id }">
        <div class="gambar">
          <img
            :src="item.url"
            alt=""
            loading="lazy"
            :class="bentuk === 'persegi' ? 'persegi' : 'bebas'"
            :style="bentuk === 'bebas' && item.lebar ? { aspectRatio: item.lebar + ' / ' + item.tinggi } : null"
          />
          <span class="nomor">{{ i + 1 }}</span>
        </div>

        <form v-if="sedangEdit === item.id" class="ubah" @submit.prevent="simpanKeterangan(item)">
          <label :for="'ket-' + item.id">Keterangan foto {{ i + 1 }}</label>
          <textarea
            :id="'ket-' + item.id"
            v-model="teksEdit"
            rows="3"
            maxlength="200"
            placeholder="Contoh: Sinta 3 – Hukum (Terbit)"
          ></textarea>
          <span class="hitung">{{ teksEdit.length }}/200</span>
          <div class="tombol">
            <button type="submit" class="primer" :disabled="menyimpan">
              {{ menyimpan ? 'Menyimpan…' : 'Simpan' }}
            </button>
            <button type="button" class="sekunder" @click="sedangEdit = null">Batal</button>
          </div>
        </form>
        <p v-else class="ket" :class="{ kosong: !item.keterangan }">
          {{ item.keterangan || 'Belum ada keterangan' }}
        </p>

        <div class="aksi">
          <button type="button" :disabled="i === 0" aria-label="Geser ke depan" @click="geser(i, -1)">
            <ArrowUp :size="16" />
          </button>
          <button type="button" :disabled="i === daftar.length - 1" aria-label="Geser ke belakang" @click="geser(i, 1)">
            <ArrowDown :size="16" />
          </button>
          <button type="button" aria-label="Ubah keterangan" @click="mulaiEdit(item)">
            <Pencil :size="16" />
          </button>
          <button type="button" class="bahaya" aria-label="Hapus foto" @click="hapus(item)">
            <Trash2 :size="16" />
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* Mobile (<641px) = default */
.kepala {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
h2 {
  margin: 0;
  font-family: var(--font-judul);
  font-size: 1.15rem;
  line-height: 1.25;
}
.petunjuk {
  margin: 0.2rem 0 0;
  color: var(--redup);
  font-size: 0.85rem;
}
.jumlah {
  flex: none;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: var(--teal-100);
  color: var(--aksen-tua);
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
  align-items: start;
  margin: 1.1rem 0 0;
  padding: 0;
  list-style: none;
}
.kartu {
  overflow: hidden;
  border: 1px solid var(--garis);
  border-radius: 12px;
  background: #fff;
  transition: box-shadow 0.2s ease;
}
.kartu:hover {
  box-shadow: var(--bayangan);
}
.kartu.mengubah {
  grid-column: 1 / -1;
}
.gambar {
  position: relative;
  background: #eef3f7;
}
img {
  display: block;
  width: 100%;
}
img.persegi {
  aspect-ratio: 1 / 1;
  object-fit: contain;
}
img.bebas {
  object-fit: cover;
}
.nomor {
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  display: grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.4rem;
  border-radius: 999px;
  background: rgba(11, 36, 71, 0.82);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}

.ket {
  margin: 0;
  padding: 0.5rem 0.6rem 0;
  font-size: 0.85rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}
.ket.kosong {
  color: #8a98ab;
  font-style: italic;
}
.ubah {
  display: grid;
  gap: 0.4rem;
  padding: 0.6rem;
}
.ubah label {
  font-size: 0.85rem;
  font-weight: 600;
}
textarea {
  width: 100%;
  min-height: 4.5rem;
  padding: 0.6rem;
  border: 1px solid #c4d2de;
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
}
textarea:focus {
  border-color: var(--aksen);
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
}
.hitung {
  justify-self: end;
  color: var(--redup);
  font-size: 0.75rem;
}
.tombol {
  display: flex;
  gap: 0.5rem;
}
.primer,
.sekunder {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.primer {
  border: 0;
  background: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  color: #fff;
}
.primer:disabled {
  opacity: 0.65;
  cursor: wait;
}
.sekunder {
  border: 1px solid var(--garis);
  background: #fff;
  color: var(--tinta);
}

.aksi {
  display: flex;
  justify-content: flex-end;
  gap: 0.3rem;
  padding: 0.45rem 0.5rem 0.5rem;
}
.aksi button {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--garis);
  border-radius: 8px;
  background: #fff;
  color: var(--tinta);
  cursor: pointer;
}
.aksi button:hover:not(:disabled) {
  background: var(--kertas);
}
.aksi button:disabled {
  opacity: 0.35;
  cursor: default;
}
.aksi .bahaya {
  color: var(--bahaya);
}

.info {
  color: var(--redup);
}
.ok {
  margin: 0.75rem 0 0;
  color: var(--ok);
  font-size: 0.85rem;
}
.error {
  margin: 0.75rem 0 0;
  color: var(--bahaya);
  font-size: 0.85rem;
}

/* Tablet */
@media (min-width: 641px) {
  h2 {
    font-size: 1.3rem;
  }
  .petunjuk {
    font-size: 0.9rem;
  }
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.8rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  h2 {
    font-size: 1.4rem;
  }
  .aksi button {
    width: 32px;
    height: 32px;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  h2 {
    font-size: 1.5rem;
  }
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
}
</style>