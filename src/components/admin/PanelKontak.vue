<script setup>
import { reactive, ref, onMounted } from 'vue'
import { Mail } from 'lucide-vue-next'
import BrandIcon from '@/components/BrandIcon.vue'
import { http } from '@/api/http'

const DAFTAR = [
  { jenis: 'WA', label: 'WhatsApp', contoh: 'https://wa.me/628xxxxxxxxxx' },
  { jenis: 'EMAIL', label: 'Email', contoh: 'nama@email.com' },
  { jenis: 'THREAD', label: 'Threads', contoh: 'https://www.threads.com/@akun' },
  { jenis: 'X', label: 'X', contoh: 'https://x.com/akun' },
  { jenis: 'IG', label: 'Instagram', contoh: 'https://www.instagram.com/akun' },
]

const nilai = reactive({ WA: '', EMAIL: '', THREAD: '', X: '', IG: '' })
const status = reactive({}) // per jenis: { sibuk, pesan, error }
const memuat = ref(true)
const errorMuat = ref('')

function tampil(jenis, url) {
  return jenis === 'EMAIL' ? url.replace(/^mailto:/, '') : url
}

onMounted(async () => {
  try {
    const data = await http('/api/admin/kontak', { auth: true })
    for (const k of data) nilai[k.jenis] = tampil(k.jenis, k.url)
  } catch (e) {
    errorMuat.value = e.message
  } finally {
    memuat.value = false
  }
})

function atur(jenis, patch) {
  status[jenis] = { sibuk: false, pesan: '', error: '', ...patch }
}

async function simpan(jenis) {
  if (!nilai[jenis].trim()) {
    atur(jenis, { error: 'Isi dulu sebelum menyimpan' })
    return
  }
  atur(jenis, { sibuk: true })
  try {
    const r = await http(`/api/admin/kontak/${jenis}`, {
      method: 'PUT',
      body: { nilai: nilai[jenis] },
      auth: true,
    })
    nilai[jenis] = tampil(jenis, r.url)
    atur(jenis, { pesan: 'Tersimpan' })
  } catch (e) {
    atur(jenis, { error: e.message })
  }
}

async function hapus(jenis) {
  if (!window.confirm('Hapus kontak ini dari landing page?')) return
  atur(jenis, { sibuk: true })
  try {
    await http(`/api/admin/kontak/${jenis}`, { method: 'DELETE', auth: true })
    nilai[jenis] = ''
    atur(jenis, { pesan: 'Dihapus' })
  } catch (e) {
    atur(jenis, { error: e.message })
  }
}
</script>

<template>
  <section>
    <h2>Kontak Kami</h2>
    <p class="petunjuk">Kontak yang dikosongkan tidak ditampilkan di landing page.</p>

    <p v-if="errorMuat" class="error" role="alert">{{ errorMuat }}</p>
    <p v-if="memuat">Memuat…</p>

    <form v-else class="daftar" @submit.prevent>
      <div v-for="k in DAFTAR" :key="k.jenis" class="baris">
        <label :for="'kontak-' + k.jenis" class="label">
          <Mail v-if="k.jenis === 'EMAIL'" :size="20" aria-hidden="true" />
          <BrandIcon v-else :nama="k.jenis" />
          {{ k.label }}
        </label>
        <input
          :id="'kontak-' + k.jenis"
          v-model="nilai[k.jenis]"
          :type="k.jenis === 'EMAIL' ? 'email' : 'url'"
          :placeholder="k.contoh"
          maxlength="300"
        />
        <div class="tombol">
          <button type="button" :disabled="status[k.jenis]?.sibuk" @click="simpan(k.jenis)">Simpan</button>
          <button type="button" class="hapus" :disabled="status[k.jenis]?.sibuk" @click="hapus(k.jenis)">Hapus</button>
        </div>
        <p v-if="status[k.jenis]?.error" class="error" role="alert">{{ status[k.jenis].error }}</p>
        <p v-else-if="status[k.jenis]?.pesan" class="ok" role="status">{{ status[k.jenis].pesan }}</p>
      </div>
    </form>
  </section>
</template>

<style scoped>
/* Mobile (<641px) = default */
h2 {
  margin: 0 0 0.25rem;
  font-size: 1.15rem;
}
.petunjuk {
  margin: 0 0 0.75rem;
  color: #555;
  font-size: 0.85rem;
}
.daftar {
  display: grid;
  gap: 0.75rem;
}
.baris {
  display: grid;
  gap: 0.4rem;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}
input {
  width: 100%;
  min-width: 0;
  padding: 0.6rem;
  border: 1px solid #bbb;
  border-radius: 8px;
  font-size: 1rem;
}
.tombol {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
button {
  padding: 0.6rem 1rem;
  border: 0;
  border-radius: 8px;
  background: #111;
  color: #fff;
  cursor: pointer;
}
button.hapus {
  background: #fff;
  color: #b00020;
  border: 1px solid #b00020;
}
button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.ok {
  margin: 0;
  color: #1b6e2d;
  font-size: 0.85rem;
}
.error {
  margin: 0;
  color: #b00020;
  font-size: 0.85rem;
}

/* Tablet */
@media (min-width: 641px) {
  h2 {
    font-size: 1.3rem;
  }
  .baris {
    padding: 1rem;
  }
  .tombol {
    display: flex;
  }
}

/* Desktop */
@media (min-width: 768px) {
  h2 {
    font-size: 1.45rem;
  }
  .baris {
    grid-template-columns: 150px minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.75rem;
  }
  .ok,
  .error {
    grid-column: 2 / -1;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  h2 {
    font-size: 1.6rem;
  }
  .baris {
    grid-template-columns: 180px minmax(0, 1fr) auto;
    padding: 1.1rem 1.25rem;
  }
}
</style>