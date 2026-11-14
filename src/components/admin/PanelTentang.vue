<script setup>
import { ref, onMounted } from 'vue'
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus } from 'lucide-vue-next'
import { http } from '@/api/http'

const MAKS_JUDUL = 100
const MAKS_ISI = 3000

const daftar = ref([])
const memuat = ref(true)
const errorMuat = ref('')
const sibuk = ref(false)
const pesan = ref('')
const error = ref('')
const form = ref(null) // null = tertutup; { id: null | number, judul, isi }

async function muat() {
  try {
    daftar.value = await http('/api/admin/tentang', { auth: true })
    errorMuat.value = ''
  } catch (e) {
    errorMuat.value = e.message
  } finally {
    memuat.value = false
  }
}
onMounted(muat)

function kabar(p = '', e = '') {
  pesan.value = p
  error.value = e
}

function tambah() {
  kabar()
  form.value = { id: null, judul: '', isi: '' }
}
function ubah(s) {
  kabar()
  form.value = { id: s.id, judul: s.judul, isi: s.isi }
}
function batal() {
  form.value = null
}

async function simpan() {
  const judul = form.value.judul.trim()
  const isi = form.value.isi.trim()
  if (!judul || !isi) {
    kabar('', 'Judul dan isi wajib diisi')
    return
  }
  sibuk.value = true
  kabar()
  try {
    if (form.value.id === null) {
      await http('/api/admin/tentang', { method: 'POST', body: { judul, isi }, auth: true })
    } else {
      await http(`/api/admin/tentang/${form.value.id}`, {
        method: 'PATCH',
        body: { judul, isi },
        auth: true,
      })
    }
    form.value = null
    await muat()
    kabar('Tersimpan')
  } catch (e) {
    kabar('', e.message)
  } finally {
    sibuk.value = false
  }
}

async function hapus(s) {
  if (!window.confirm(`Hapus section "${s.judul}" dari halaman About?`)) return
  sibuk.value = true
  kabar()
  try {
    await http(`/api/admin/tentang/${s.id}`, { method: 'DELETE', auth: true })
    await muat()
    kabar('Dihapus')
  } catch (e) {
    kabar('', e.message)
  } finally {
    sibuk.value = false
  }
}

async function pindah(i, arah) {
  const j = i + arah
  if (j < 0 || j >= daftar.value.length) return
  const salinan = [...daftar.value]
  ;[salinan[i], salinan[j]] = [salinan[j], salinan[i]]
  daftar.value = salinan
  kabar()
  try {
    await http('/api/admin/tentang/urutan', {
      method: 'PUT',
      body: { ids: salinan.map((s) => s.id) },
      auth: true,
    })
  } catch (e) {
    kabar('', e.message)
    await muat() // kembalikan ke urutan di server
  }
}
</script>

<template>
  <section>
    <h2>Halaman About</h2>
    <p class="petunjuk">
      Setiap section tampil berurutan di halaman About. Baris baru pada isi ikut tampil sebagai
      paragraf.
    </p>

    <p v-if="errorMuat" class="error" role="alert">{{ errorMuat }}</p>
    <p v-if="memuat">Memuat…</p>

    <template v-else>
      <button v-if="!form" type="button" class="utama" @click="tambah">
        <Plus :size="18" aria-hidden="true" /> Tambah section
      </button>

      <form v-if="form" class="form" @submit.prevent="simpan">
        <h3>{{ form.id === null ? 'Section baru' : 'Ubah section' }}</h3>
        <label for="tentang-judul">Judul</label>
        <input
          id="tentang-judul"
          v-model="form.judul"
          type="text"
          :maxlength="MAKS_JUDUL"
          placeholder="Contoh: Cerita Kami"
        />
        <label for="tentang-isi">Isi</label>
        <textarea
          id="tentang-isi"
          v-model="form.isi"
          rows="8"
          :maxlength="MAKS_ISI"
          placeholder="Tulis isi section…"
        ></textarea>
        <small>{{ form.isi.length }}/{{ MAKS_ISI }}</small>
        <div class="tombol">
          <button type="submit" class="utama" :disabled="sibuk">
            {{ sibuk ? 'Menyimpan…' : 'Simpan' }}
          </button>
          <button type="button" class="sekunder" :disabled="sibuk" @click="batal">Batal</button>
        </div>
      </form>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-else-if="pesan" class="ok" role="status">{{ pesan }}</p>

      <p v-if="!daftar.length && !form" class="kosong">
        Belum ada section. Halaman About akan kosong sampai kamu menambahkannya.
      </p>

      <ol class="daftar">
        <li v-for="(s, i) in daftar" :key="s.id" class="item">
          <div class="teks">
            <strong>{{ s.judul }}</strong>
            <p>{{ s.isi }}</p>
          </div>
          <div class="aksi">
            <button
              type="button"
              class="ikon"
              aria-label="Naikkan"
              :disabled="sibuk || i === 0"
              @click="pindah(i, -1)"
            >
              <ArrowUp :size="18" />
            </button>
            <button
              type="button"
              class="ikon"
              aria-label="Turunkan"
              :disabled="sibuk || i === daftar.length - 1"
              @click="pindah(i, 1)"
            >
              <ArrowDown :size="18" />
            </button>
            <button type="button" class="ikon" aria-label="Ubah" :disabled="sibuk" @click="ubah(s)">
              <Pencil :size="18" />
            </button>
            <button
              type="button"
              class="ikon bahaya"
              aria-label="Hapus"
              :disabled="sibuk"
              @click="hapus(s)"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </li>
      </ol>
    </template>
  </section>
</template>

<style scoped>
/* Mobile (<641px) = default */
h2 {
  margin: 0 0 0.25rem;
  font-family: var(--font-judul);
  font-size: 1.15rem;
}
h3 {
  margin: 0;
  font-family: var(--font-judul);
  font-size: 1.05rem;
}
.petunjuk {
  margin: 0 0 1rem;
  color: var(--redup);
  font-size: 0.85rem;
}
.kosong {
  color: var(--redup);
  font-size: 0.9rem;
}
.form {
  display: grid;
  gap: 0.5rem;
  margin: 0.75rem 0;
  padding: 0.9rem;
  border: 1px solid var(--garis);
  border-radius: 12px;
  background: #fff;
}
label {
  font-size: 0.875rem;
  font-weight: 600;
}
input,
textarea {
  width: 100%;
  min-width: 0;
  padding: 0.65rem 0.85rem;
  border: 1px solid #c4d2de;
  border-radius: 10px;
  background: #fff;
  color: var(--tinta);
  font-size: 1rem;
  line-height: 1.5;
}
input {
  height: 44px;
  padding-block: 0;
}
textarea {
  resize: vertical;
}
input:focus,
textarea:focus {
  border-color: var(--aksen);
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
}
small {
  color: var(--redup);
  text-align: right;
}
.tombol {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
button.utama,
button.sekunder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 42px;
  padding: 0 1rem;
  border: 0;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
button.utama {
  background: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  color: #fff;
}
button.sekunder {
  border: 1px solid var(--garis);
  background: #fff;
  color: var(--tinta);
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.daftar {
  display: grid;
  gap: 0.6rem;
  margin: 0.9rem 0 0;
  padding: 0;
  list-style: none;
}
.item {
  display: grid;
  gap: 0.6rem;
  padding: 0.85rem;
  border: 1px solid var(--garis);
  border-radius: 12px;
  background: #fff;
}
.teks {
  min-width: 0;
}
.teks p {
  display: -webkit-box;
  margin: 0.25rem 0 0;
  overflow: hidden;
  color: var(--redup);
  font-size: 0.9rem;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow-wrap: anywhere;
  white-space: pre-line;
}
.aksen,
.aksi {
  display: flex;
  gap: 0.4rem;
}
.ikon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--garis);
  border-radius: 10px;
  background: #fff;
  color: var(--tinta);
  cursor: pointer;
}
.ikon.bahaya {
  border-color: #e3b4b0;
  color: var(--bahaya);
}
.ok {
  margin: 0.5rem 0 0;
  color: var(--ok);
  font-size: 0.85rem;
}
.error {
  margin: 0.5rem 0 0;
  color: var(--bahaya);
  font-size: 0.85rem;
}

/* Tablet */
@media (min-width: 641px) {
  h2 {
    font-size: 1.3rem;
  }
  .form {
    padding: 1.1rem;
  }
  .tombol {
    display: flex;
  }
}

/* Desktop */
@media (min-width: 768px) {
  h2 {
    font-size: 1.4rem;
  }
  .item {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 1rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  h2 {
    font-size: 1.5rem;
  }
  .item {
    padding: 1rem 1.25rem;
  }
}
</style>
