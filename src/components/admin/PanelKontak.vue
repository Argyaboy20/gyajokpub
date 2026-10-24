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
  font-family: var(--font-judul);
  font-size: 1.15rem;
}
.petunjuk {
  margin: 0 0 1rem;
  color: var(--redup);
  font-size: 0.85rem;
}
.daftar {
  display: grid;
  gap: 0.75rem;
}
.baris {
  display: grid;
  gap: 0.45rem;
  padding: 0.85rem;
  border: 1px solid var(--garis);
  border-radius: 12px;
  background: #fff;
}
.label {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 600;
}
.label svg {
  color: var(--aksen);
}
input {
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 0.85rem;
  border: 1px solid #c4d2de;
  border-radius: 10px;
  font-size: 1rem;
}
input:focus {
  border-color: var(--aksen);
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
}
.tombol {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
button {
  height: 40px;
  padding: 0 1rem;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
button.hapus {
  border: 1px solid #e3b4b0;
  background: #fff;
  color: var(--bahaya);
}
button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.ok {
  margin: 0;
  color: var(--ok);
  font-size: 0.85rem;
}
.error {
  margin: 0;
  color: var(--bahaya);
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
    font-size: 1.4rem;
  }
  .baris {
    grid-template-columns: 140px minmax(0, 1fr) auto;
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
    font-size: 1.5rem;
  }
  .baris {
    grid-template-columns: 170px minmax(0, 1fr) auto;
    padding: 1.1rem 1.25rem;
  }
}
</style>