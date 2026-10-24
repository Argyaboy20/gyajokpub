<script setup>
import { onMounted, ref } from 'vue'
import { ArrowRight, LoaderCircle } from 'lucide-vue-next'
import { useKontenStore } from '@/stores/konten'
import GaleriFoto from '@/components/GaleriFoto.vue'
import LightboxFoto from '@/components/LightboxFoto.vue'
import KontakKami from '@/components/KontakKami.vue'
import ChatWidget from '@/components/ChatWidget.vue'
import LOGO from '../../assets/logogyajokpub.png'

const konten = useKontenStore()
onMounted(konten.muat)

const logoGagal = ref(false)
const tahun = new Date().getFullYear()

const PRICELIST = [
  { kunci: 'publikasi-jurnal', judul: 'PRICELIST PUBLIKASI JURNAL' },
  { kunci: 'non-sinta', judul: 'PRICELIST NON SINTA' },
  { kunci: 'pembuatan-artikel', judul: 'PRICELIST PEMBUATAN ARTIKEL' },
]

const lb = ref({ foto: [], index: -1 })
function buka(foto, i) {
  lb.value = { foto, index: i }
}
function tutup() {
  lb.value = { foto: [], index: -1 }
}
function ganti(i) {
  lb.value = { ...lb.value, index: i }
}
</script>

<template>
  <div class="landing">
    <header class="hero">
      <span class="chip">
        <img v-if="!logoGagal" :src="LOGO" alt="GyaJokPub" @error="logoGagal = true" />
        <strong v-else>GyaJokPub</strong>
      </span>
      <h1>Publication Made Simpler</h1>
      <p class="sub">Partner Publikasi Jurnal untuk Mahasiswa, Dosen, dan Peneliti.</p>
      <a v-if="konten.data.kontak.length" class="cta" href="#kontak">
        Hubungi Kami <ArrowRight :size="18" aria-hidden="true" />
      </a>
    </header>

    <main class="konten">
      <section class="panel" aria-labelledby="h-tentang">
        <h2 id="h-tentang">TENTANG GYAJOKPUB</h2>
        <p class="narasi">
          GyaJokPub hadir untuk memberikan solusi publikasi jurnal yang lebih mudah, aman, dan terjangkau. Mulai dari
          Sinta 1–6, non sinta nasional hingga non sinta internasional, hingga Scopus Q3 dan Q4 dengan pendampingan
          penuh sampai artikel terbit.
        </p>
      </section>

      <p v-if="konten.memuat" class="status" role="status">
        <LoaderCircle class="putar" :size="20" aria-hidden="true" />
        {{ konten.lambat ? 'Mohon tunggu sebentar ya...' : 'Memuat konten…' }}
      </p>

      <div v-else-if="konten.error" class="status" role="alert">
        <p>{{ konten.error }}</p>
        <button type="button" @click="konten.muat">Coba lagi</button>
      </div>

      <template v-else>
        <section v-if="konten.data.trackRecord.length" class="panel" aria-labelledby="h-track">
          <h2 id="h-track">TRACK RECORD PUBLIKASI</h2>
          <GaleriFoto
            :foto="konten.data.trackRecord"
            bentuk="bebas"
            label="Track record"
            @buka="(i) => buka(konten.data.trackRecord, i)"
          />
        </section>

        <template v-for="p in PRICELIST" :key="p.kunci">
          <section v-if="(konten.data.pricelist[p.kunci] ?? []).length" class="panel" :aria-labelledby="'h-' + p.kunci">
            <h2 :id="'h-' + p.kunci">{{ p.judul }}</h2>
            <GaleriFoto
              :foto="konten.data.pricelist[p.kunci]"
              bentuk="persegi"
              label="Pricelist"
              @buka="(i) => buka(konten.data.pricelist[p.kunci], i)"
            />
          </section>
        </template>

        <section v-if="konten.data.kontak.length" id="kontak" class="panel kontak" aria-labelledby="h-kontak">
          <h2 id="h-kontak">KONTAK KAMI</h2>
          <KontakKami :kontak="konten.data.kontak" />
        </section>
      </template>
    </main>

    <footer class="kaki">
      <strong>GyaJokPub</strong>
      <span>Publication Made Simpler</span>
      <small>© {{ tahun }} GyaJokPub</small>
    </footer>

    <LightboxFoto :foto="lb.foto" :index="lb.index" @tutup="tutup" @ganti="ganti" />
    <ChatWidget />
  </div>
</template>

<style scoped>
/* Mobile (<641px) = default */
.landing {
  min-height: 100vh;
}

.hero {
  padding: 2rem 1.25rem 3.75rem;
  background:
    radial-gradient(circle at 88% 0%, rgba(255, 255, 255, 0.16), transparent 45%),
    radial-gradient(circle at 8% 100%, rgba(212, 169, 74, 0.2), transparent 42%),
    var(--gradien);
  color: #fff;
  text-align: center;
}
.chip {
  display: inline-grid;
  place-items: center;
  padding: 0.8rem 1.2rem;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 28px -14px rgba(0, 0, 0, 0.55);
}
.chip img {
  display: block;
  max-width: 100%;
  max-height: 80px;
}
.chip strong {
  color: var(--navy-900);
  font-family: var(--font-judul);
  font-size: 1.5rem;
}
h1 {
  margin: 1.25rem 0 0.4rem;
  font-family: var(--font-judul);
  font-size: 1.35rem;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.sub {
  max-width: 34ch;
  margin: 0 auto;
  font-size: 0.95rem;
  opacity: 0.92;
}
.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding: 0.75rem 1.4rem;
  border-radius: 999px;
  background: var(--emas);
  color: var(--navy-900);
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 18px -10px rgba(0, 0, 0, 0.6);
  transition:
    filter 0.2s ease,
    transform 0.15s ease;
}
.cta:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}
.cta:focus-visible {
  outline-color: #fff;
}

.konten {
  position: relative;
  display: grid;
  gap: 1rem;
  max-width: 100%;
  margin: -1.9rem auto 0;
  padding: 0 0.75rem 2rem;
}
.panel {
  padding: 1.25rem;
  border: 1px solid var(--garis);
  border-radius: 18px;
  background: var(--permukaan);
  box-shadow: var(--bayangan);
  scroll-margin-top: 1rem;
}
h2 {
  margin: 0 0 1.1rem;
  font-family: var(--font-judul);
  font-size: 1.1rem;
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
.narasi {
  max-width: 70ch;
  margin: 0;
  font-size: 1rem;
  line-height: 1.75;
}

.panel.kontak {
  border: 0;
  background:
    radial-gradient(circle at 90% 0%, rgba(255, 255, 255, 0.14), transparent 45%),
    var(--gradien);
  color: #fff;
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
  margin-top: 1rem;
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
    padding: 2.75rem 1.5rem 4.5rem;
  }
  .chip img {
    max-height: 96px;
  }
  h1 {
    font-size: 1.6rem;
  }
  .sub {
    max-width: 44ch;
    font-size: 1.05rem;
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
    padding: 3.5rem 2rem 5.5rem;
  }
  .chip img {
    max-height: 112px;
  }
  h1 {
    font-size: 1.9rem;
  }
  .sub {
    max-width: none;
    font-size: 1.15rem;
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
    padding: 4.5rem 2.5rem 6.5rem;
  }
  .chip {
    padding: 1rem 1.6rem;
  }
  .chip img {
    max-height: 128px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .sub {
    font-size: 1.25rem;
  }
  .konten {
    max-width: 1100px;
    margin-top: -3.5rem;
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