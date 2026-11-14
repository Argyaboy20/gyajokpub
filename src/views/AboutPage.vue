<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { LoaderCircle, ShieldCheck } from 'lucide-vue-next'
import { http } from '@/api/http'
import { vMuncul } from '@/utils/muncul'
import NavbarPublik from '@/components/NavbarPublik.vue'

const section = ref([])
const memuat = ref(true)
const error = ref('')
const tahun = new Date().getFullYear()

async function muat() {
  memuat.value = true
  error.value = ''
  try {
    section.value = await http('/api/public/tentang')
  } catch (e) {
    error.value = e.message
  } finally {
    memuat.value = false
  }
}
onMounted(muat)
</script>

<template>
  <div class="halaman">
    <NavbarPublik />

    <header class="hero">
      <h1>Tentang GyaJokPub</h1>
      <p>Publication Made Simpler</p>
    </header>

    <main class="konten">
      <p v-if="memuat" class="status" role="status">
        <LoaderCircle class="putar" :size="20" aria-hidden="true" /> Memuat…
      </p>

      <div v-else-if="error" class="status" role="alert">
        <p>{{ error }}</p>
        <button type="button" @click="muat">Coba lagi</button>
      </div>

      <template v-else>
        <p v-if="!section.length" class="status">Halaman ini belum memiliki isi.</p>

        <section
          v-for="(s, i) in section"
          :key="s.id"
          class="panel"
          :aria-labelledby="'tentang-' + s.id"
        >
          <h2 :id="'tentang-' + s.id" v-muncul="{ arah: i % 2 ? 'kanan' : 'kiri' }">
            {{ s.judul }}
          </h2>
          <p class="isi">{{ s.isi }}</p>
        </section>

        <div class="lanjut">
          <RouterLink to="/privacypolicy" class="tombol">
            <ShieldCheck :size="18" aria-hidden="true" /> Privacy Policy
          </RouterLink>
        </div>
      </template>
    </main>

    <footer class="kaki">
      <strong>GyaJokPub</strong>
      <span>Publication Made Simpler</span>
      <small>© {{ tahun }} GyaJokPub</small>
    </footer>
  </div>
</template>

<style scoped>
/* Mobile (<641px) = default */
.halaman {
  min-height: 100dvh;
}
.hero {
  padding: 5.5rem 1.25rem 3.5rem;
  background:
    radial-gradient(circle at 88% 0%, rgba(255, 255, 255, 0.16), transparent 45%),
    radial-gradient(circle at 8% 100%, rgba(212, 169, 74, 0.2), transparent 42%), var(--gradien);
  color: #fff;
  text-align: center;
}
.hero h1 {
  margin: 0 0 0.3rem;
  font-family: var(--font-judul);
  font-size: 1.5rem;
  line-height: 1.2;
}
.hero p {
  margin: 0;
  opacity: 0.92;
}

.konten {
  display: grid;
  gap: 1rem;
  margin: -1.9rem auto 0;
  padding: 0 0.75rem 2rem;
}
.panel {
  padding: 1.25rem;
  overflow-x: clip;
  border: 1px solid var(--garis);
  border-radius: 18px;
  background: var(--permukaan);
  box-shadow: var(--bayangan);
}
h2 {
  margin: 0 0 1rem;
  font-family: var(--font-judul);
  font-size: 1.15rem;
  line-height: 1.3;
}
h2::after {
  content: '';
  display: block;
  width: 44px;
  height: 3px;
  margin-top: 0.6rem;
  border-radius: 3px;
  background: var(--emas);
}
.isi {
  max-width: 70ch;
  margin: 0;
  line-height: 1.75;
  overflow-wrap: anywhere;
  white-space: pre-line; /* baris baru dari admin tampil sebagai paragraf */
}

.lanjut {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}
.tombol {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 18px -10px rgba(11, 36, 71, 0.6);
  transition:
    filter 0.2s ease,
    transform 0.15s ease;
}
.tombol:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1.5rem 1rem;
  color: var(--redup);
  text-align: center;
}
.status p {
  margin: 0;
}
.status button {
  padding: 0.6rem 1.3rem;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.putar {
  animation: putar 0.9s linear infinite;
}
@keyframes putar {
  to {
    transform: rotate(360deg);
  }
}

.kaki {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 1.75rem 1rem;
  background: var(--navy-900);
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.875rem;
  text-align: center;
}
.kaki strong {
  color: #fff;
  font-family: var(--font-judul);
  font-size: 1.1rem;
}
.kaki small {
  margin-top: 0.4rem;
  opacity: 0.8;
}

/* Tablet */
@media (min-width: 641px) {
  .hero {
    padding: 6rem 1.5rem 4rem;
  }
  .hero h1 {
    font-size: 1.8rem;
  }
  .konten {
    gap: 1.25rem;
    margin-top: -2.5rem;
    padding: 0 1.5rem 2.5rem;
  }
  .panel {
    padding: 1.75rem;
  }
  h2 {
    font-size: 1.25rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .hero {
    padding: 6.5rem 2rem 5rem;
  }
  .hero h1 {
    font-size: 2.1rem;
  }
  .konten {
    max-width: 900px;
    gap: 1.5rem;
    margin-top: -3rem;
    padding: 0 2rem 3rem;
  }
  .panel {
    padding: 2.25rem;
  }
  h2 {
    font-size: 1.4rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .hero {
    padding: 7rem 2.5rem 5.5rem;
  }
  .hero h1 {
    font-size: 2.4rem;
  }
  .konten {
    max-width: 1000px;
    padding: 0 2.5rem 3.5rem;
  }
  .panel {
    padding: 2.5rem;
  }
  h2 {
    font-size: 1.5rem;
  }
}
</style>
