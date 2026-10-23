<script setup>
import { ref, onMounted } from 'vue'
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-vue-next'
import { http } from '@/api/http'
import UploadGambar from './UploadGambar.vue'

const props = defineProps({
  judul: { type: String, required: true },
  petunjuk: { type: String, default: '' },
  daftarUrl: { type: String, required: true }, // GET + POST; urutan = daftarUrl + '/urutan'
  hapusUrl: { type: String, required: true }, // DELETE hapusUrl/:id
  bentuk: { type: String, default: 'persegi' }, // 'bebas' (ikut foto) | 'persegi'
})

const daftar = ref([])
const memuat = ref(true)
const mengunggah = ref(false)
const pesan = ref('')
const error = ref('')

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
</script>

<template>
  <section>
    <h2>{{ judul }}</h2>
    <p v-if="petunjuk" class="petunjuk">{{ petunjuk }}</p>

    <UploadGambar :memuat="mengunggah" @pilih="unggah" />

    <p v-if="pesan" class="ok" role="status">{{ pesan }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <p v-if="memuat">Memuat…</p>
    <p v-else-if="!daftar.length" class="kosong">Belum ada foto.</p>

    <ul v-else class="grid">
      <li v-for="(item, i) in daftar" :key="item.id" class="kartu">
        <img
          :src="item.url"
          alt=""
          loading="lazy"
          :class="bentuk === 'persegi' ? 'persegi' : 'bebas'"
          :style="bentuk === 'bebas' && item.lebar ? { aspectRatio: item.lebar + ' / ' + item.tinggi } : null"
        />
        <div class="aksi">
          <span class="nomor">#{{ i + 1 }}</span>
          <button type="button" :disabled="i === 0" aria-label="Geser ke depan" @click="geser(i, -1)">
            <ArrowUp :size="16" />
          </button>
          <button type="button" :disabled="i === daftar.length - 1" aria-label="Geser ke belakang" @click="geser(i, 1)">
            <ArrowDown :size="16" />
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
h2 {
  margin: 0 0 0.25rem;
  font-size: 1.15rem;
  overflow-wrap: anywhere;
}
.petunjuk {
  margin: 0 0 0.75rem;
  color: #555;
  font-size: 0.85rem;
}
.grid {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
  align-items: start;
}
.kartu {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}
img {
  display: block;
  width: 100%;
  background: #f1f1f1;
}
img.persegi {
  aspect-ratio: 1 / 1;
  object-fit: contain;
}
img.bebas {
  object-fit: cover;
}
.aksi {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.4rem;
}
.nomor {
  flex: 1;
  font-size: 0.75rem;
  color: #666;
}
.aksi button {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.aksi button:disabled {
  opacity: 0.35;
  cursor: default;
}
.aksi .bahaya {
  color: #b00020;
}
.kosong {
  color: #666;
}
.ok {
  color: #1b6e2d;
  font-size: 0.85rem;
}
.error {
  color: #b00020;
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
    font-size: 1.45rem;
  }
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
  .aksi button {
    width: 32px;
    height: 32px;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  h2 {
    font-size: 1.6rem;
  }
  .grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 1.25rem;
  }
  .aksi button {
    width: 30px;
    height: 30px;
  }
}
</style>