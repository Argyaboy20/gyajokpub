<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Plus, Pencil, Trash2, Copy, Check, ExternalLink, ImageUp } from 'lucide-vue-next'
import { http } from '@/api/http'

const STATUS = [
  { nilai: 'SUBMIT', label: 'Submit' },
  { nilai: 'REVIEW', label: 'Review' },
  { nilai: 'LOA', label: 'LoA' },
  { nilai: 'SELESAI', label: 'Selesai' },
]
const labelStatus = (v) => STATUS.find((s) => s.nilai === v)?.label ?? v

const MAKS_BYTE = 8 * 1024 * 1024

const daftar = ref([])
const memuat = ref(true)
const errorMuat = ref('')
const sibuk = ref(false)
const pesan = ref('')
const error = ref('')
const form = ref(null) // null = tertutup
const berkas = ref(null)
const praTinjau = ref('')
const disalin = ref('')

async function muat() {
  try {
    daftar.value = await http('/api/admin/pesanan', { auth: true })
    errorMuat.value = ''
  } catch (e) {
    errorMuat.value = e.message
  } finally {
    memuat.value = false
  }
}
onMounted(muat)

function bersihkanPra() {
  if (praTinjau.value) URL.revokeObjectURL(praTinjau.value)
  praTinjau.value = ''
  berkas.value = null
}
onBeforeUnmount(bersihkanPra)

function kabar(p = '', e = '') {
  pesan.value = p
  error.value = e
}

function tambah() {
  kabar()
  bersihkanPra()
  form.value = {
    id: null,
    nama: '',
    judul: '',
    tujuan: '',
    linkJurnal: '',
    status: 'SUBMIT',
    buktiUrl: null,
    hapusBukti: false,
  }
}
function ubah(p) {
  kabar()
  bersihkanPra()
  form.value = {
    id: p.id,
    nama: p.nama,
    judul: p.judul,
    tujuan: p.tujuan,
    linkJurnal: p.linkJurnal ?? '',
    status: p.status,
    buktiUrl: p.buktiUrl,
    hapusBukti: false,
  }
}
function batal() {
  bersihkanPra()
  form.value = null
}

function pilihBukti(e) {
  const f = e.target.files?.[0]
  e.target.value = ''
  if (!f) return
  if (!f.type.startsWith('image/')) {
    kabar('', 'Bukti harus berupa gambar')
    return
  }
  if (f.size > MAKS_BYTE) {
    kabar('', 'Foto bukti lebih dari 8 MB')
    return
  }
  kabar()
  bersihkanPra()
  berkas.value = f
  praTinjau.value = URL.createObjectURL(f)
  form.value.hapusBukti = false
}

async function simpan() {
  const f = form.value
  if (!f.nama.trim() || !f.judul.trim() || !f.tujuan.trim()) {
    kabar('', 'Nama pesanan, judul naskah, dan tujuan rumah jurnal wajib diisi')
    return
  }
  if (f.linkJurnal.trim() && !/^https:\/\//i.test(f.linkJurnal.trim())) {
    kabar('', 'Link rumah jurnal harus diawali https://')
    return
  }
  const data = new FormData()
  data.append('nama', f.nama)
  data.append('judul', f.judul)
  data.append('tujuan', f.tujuan)
  data.append('linkJurnal', f.linkJurnal)
  data.append('status', f.status)
  if (berkas.value) data.append('bukti', berkas.value)
  if (f.hapusBukti) data.append('hapusBukti', 'true')

  sibuk.value = true
  kabar()
  try {
    const baru = f.id === null
    const r = await http(baru ? '/api/admin/pesanan' : `/api/admin/pesanan/${f.id}`, {
      method: baru ? 'POST' : 'PATCH',
      form: data,
      auth: true,
    })
    batal()
    await muat()
    kabar(baru ? `Pesanan dibuat. Nomor: ${r.nomor}` : 'Perubahan disimpan')
  } catch (e) {
    kabar('', e.message)
  } finally {
    sibuk.value = false
  }
}

async function hapus(p) {
  if (!window.confirm(`Hapus pesanan ${p.nomor}? Nomor ini tidak akan bisa dilacak lagi.`)) return
  sibuk.value = true
  kabar()
  try {
    await http(`/api/admin/pesanan/${p.id}`, { method: 'DELETE', auth: true })
    await muat()
    kabar('Pesanan dihapus')
  } catch (e) {
    kabar('', e.message)
  } finally {
    sibuk.value = false
  }
}

async function salin(nomor) {
  try {
    await navigator.clipboard.writeText(nomor)
    disalin.value = nomor
    setTimeout(() => {
      if (disalin.value === nomor) disalin.value = ''
    }, 1800)
  } catch {
    kabar('', 'Tidak bisa menyalin otomatis. Salin nomor secara manual.')
  }
}
</script>

<template>
  <section>
    <h2>Lacak Naskah</h2>
    <p class="petunjuk">
      Nomor pesanan dibuat otomatis setelah disimpan. Pengunjung bisa melacak pesanan dengan nomor
      itu di landing page. Bukti dan semua isi pesanan tampil publik, jadi samarkan data pribadi
      pada foto bukti.
    </p>

    <p v-if="errorMuat" class="error" role="alert">{{ errorMuat }}</p>
    <p v-if="memuat">Memuat…</p>

    <template v-else>
      <button v-if="!form" type="button" class="utama" @click="tambah">
        <Plus :size="18" aria-hidden="true" /> Tambah pesanan
      </button>

      <form v-if="form" class="form" @submit.prevent="simpan">
        <h3>{{ form.id === null ? 'Pesanan baru' : 'Ubah pesanan' }}</h3>

        <label for="p-nama">Nama pesanan</label>
        <input
          id="p-nama"
          v-model="form.nama"
          type="text"
          maxlength="100"
          placeholder="Contoh: SINTA 3 - HUKUM"
        />

        <label for="p-judul">Judul naskah</label>
        <input id="p-judul" v-model="form.judul" type="text" maxlength="300" />

        <label for="p-tujuan">Tujuan rumah jurnal</label>
        <input id="p-tujuan" v-model="form.tujuan" type="text" maxlength="150" />

        <label for="p-link">Link rumah jurnal (opsional)</label>
        <input
          id="p-link"
          v-model="form.linkJurnal"
          type="url"
          maxlength="300"
          placeholder="https://"
        />

        <label for="p-status">Status</label>
        <select id="p-status" v-model="form.status">
          <option v-for="s in STATUS" :key="s.nilai" :value="s.nilai">{{ s.label }}</option>
        </select>

        <span class="label">Bukti (gambar, opsional, satu foto)</span>
        <div class="bukti">
          <img v-if="praTinjau" :src="praTinjau" alt="Pratinjau bukti" />
          <img
            v-else-if="form.buktiUrl && !form.hapusBukti"
            :src="form.buktiUrl"
            alt="Bukti saat ini"
          />
          <label class="pilih">
            <ImageUp :size="18" aria-hidden="true" />
            {{ praTinjau || (form.buktiUrl && !form.hapusBukti) ? 'Ganti foto' : 'Pilih foto' }}
            <input class="sembunyi" type="file" accept="image/*" @change="pilihBukti" />
          </label>
          <button
            v-if="form.buktiUrl && !praTinjau && !form.hapusBukti"
            type="button"
            class="sekunder"
            @click="form.hapusBukti = true"
          >
            Hapus bukti
          </button>
          <small v-if="form.hapusBukti">Bukti akan dihapus saat disimpan.</small>
        </div>

        <div class="tombol">
          <button type="submit" class="utama" :disabled="sibuk">
            {{ sibuk ? 'Menyimpan…' : 'Simpan' }}
          </button>
          <button type="button" class="sekunder" :disabled="sibuk" @click="batal">Batal</button>
        </div>
      </form>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-else-if="pesan" class="ok" role="status">{{ pesan }}</p>

      <p v-if="!daftar.length && !form" class="kosong">Belum ada pesanan.</p>

      <ul class="daftar">
        <li v-for="p in daftar" :key="p.id" class="item">
          <div class="teks">
            <div class="baris-nomor">
              <code>{{ p.nomor }}</code>
              <button
                type="button"
                class="salin"
                :aria-label="'Salin ' + p.nomor"
                @click="salin(p.nomor)"
              >
                <Check v-if="disalin === p.nomor" :size="16" />
                <Copy v-else :size="16" />
              </button>
              <span class="status" :data-status="p.status">{{ labelStatus(p.status) }}</span>
            </div>
            <strong>{{ p.nama }}</strong>
            <p>{{ p.judul }}</p>
            <small>
              {{ p.tujuan }}
              <a v-if="p.linkJurnal" :href="p.linkJurnal" target="_blank" rel="noopener noreferrer">
                <ExternalLink :size="13" aria-hidden="true" /> Link
              </a>
            </small>
          </div>
          <img v-if="p.buktiUrl" class="mini" :src="p.buktiUrl" alt="Bukti" loading="lazy" />
          <div class="aksi">
            <button type="button" class="ikon" aria-label="Ubah" :disabled="sibuk" @click="ubah(p)">
              <Pencil :size="18" />
            </button>
            <button
              type="button"
              class="ikon bahaya"
              aria-label="Hapus"
              :disabled="sibuk"
              @click="hapus(p)"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </li>
      </ul>
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
label,
.label {
  font-size: 0.875rem;
  font-weight: 600;
}
input[type='text'],
input[type='url'],
select {
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 0.85rem;
  border: 1px solid #c4d2de;
  border-radius: 10px;
  background: #fff;
  color: var(--tinta);
  font-size: 1rem;
}
input:focus,
select:focus {
  border-color: var(--aksen);
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
}
.bukti {
  display: grid;
  gap: 0.5rem;
  justify-items: start;
}
.bukti img {
  width: 100%;
  max-width: 220px;
  border: 1px solid var(--garis);
  border-radius: 10px;
  background: #eef3f7;
}
.pilih {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border: 1px dashed #9fb6c8;
  border-radius: 10px;
  background: #f8fbfd;
  cursor: pointer;
}
.pilih:focus-within {
  outline: 3px solid var(--aksen);
  outline-offset: 2px;
}
.sembunyi {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
small {
  color: var(--redup);
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
  margin: 0.2rem 0;
  color: var(--redup);
  font-size: 0.9rem;
  overflow-wrap: anywhere;
}
.teks small a {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  margin-left: 0.4rem;
  color: var(--aksen-tua);
}
.baris-nomor {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.3rem;
}
code {
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  background: var(--kertas);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.salin {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--garis);
  border-radius: 8px;
  background: #fff;
  color: var(--tinta);
  cursor: pointer;
}
.status {
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  background: var(--teal-100);
  color: var(--aksen-tua);
  font-size: 0.78rem;
  font-weight: 700;
}
.status[data-status='SELESAI'] {
  background: #dff3e8;
  color: var(--ok);
}
.mini {
  width: 88px;
  border: 1px solid var(--garis);
  border-radius: 8px;
}
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
    grid-template-columns: minmax(0, 1fr) auto auto;
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
