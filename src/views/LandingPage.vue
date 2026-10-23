<script setup>
import { onMounted, ref } from 'vue'
import { useKontenStore } from '@/stores/konten'
import GaleriFoto from '@/components/GaleriFoto.vue'
import LightboxFoto from '@/components/LightboxFoto.vue'
import KontakKami from '@/components/KontakKami.vue'
import ChatWidget from '@/components/ChatWidget.vue'

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
      <img v-if="!logoGagal" class="logo" src="/assets/logogyajokpub.png" alt="GyaJokPub" @error="logoGagal = true" />
      <p v-else class="logo-teks">GyaJokPub</p>
      <h1>Publication Made Simpler</h1>
      <p class="sub">Partner Publikasi Jurnal untuk Mahasiswa, Dosen, dan Peneliti.</p>
    </header>

    <main>
      <section class="blok" aria-labelledby="h-tentang">
        <div class="isi">
          <h2 id="h-tentang">TENTANG GYAJOKPUB</h2>
          <p class="narasi">
            GyaJokPub hadir untuk memberikan solusi publikasi jurnal yang lebih mudah, aman, dan terjangkau. Mulai dari
            Sinta 1–6, non sinta nasional hingga non sinta internasional, hingga Scopus Q3 dan Q4 dengan pendampingan
            penuh sampai artikel terbit.
          </p>
        </div>
      </section>

      <p v-if="konten.memuat" class="status" role="status">
        {{ konten.lambat ? 'Server sedang bangun, mohon tunggu sebentar…' : 'Memuat konten…' }}
      </p>

      <div v-else-if="konten.error" class="status" role="alert">
        <p>{{ konten.error }}</p>
        <button type="button" @click="konten.muat">Coba lagi</button>
      </div>

      <template v-else>
        <section v-if="konten.data.trackRecord.length" class="blok" aria-labelledby="h-track">
          <div class="isi">
            <h2 id="h-track">TRACK RECORD PUBLIKASI</h2>
            <GaleriFoto
              :foto="konten.data.trackRecord"
              bentuk="bebas"
              label="Track record"
              @buka="(i) => buka(konten.data.trackRecord, i)"
            />
          </div>
        </section>

        <template v-for="p in PRICELIST" :key="p.kunci">
          <section v-if="(konten.data.pricelist[p.kunci] ?? []).length" class="blok" :aria-labelledby="'h-' + p.kunci">
            <div class="isi">
              <h2 :id="'h-' + p.kunci">{{ p.judul }}</h2>
              <GaleriFoto
                :foto="konten.data.pricelist[p.kunci]"
                bentuk="persegi"
                label="Pricelist"
                @buka="(i) => buka(konten.data.pricelist[p.kunci], i)"
              />
            </div>
          </section>
        </template>

        <section v-if="konten.data.kontak.length" class="blok" aria-labelledby="h-kontak">
          <div class="isi">
            <h2 id="h-kontak">KONTAK KAMI</h2>
            <KontakKami :kontak="konten.data.kontak" />
          </div>
        </section>
      </template>
    </main>

    <footer class="kaki">GyaJokPub © {{ tahun }}</footer>

    <LightboxFoto :foto="lb.foto" :index="lb.index" @tutup="tutup" @ganti="ganti" />
    <ChatWidget />
  </div>
</template>

<style scoped>
/* Mobile (<641px) = default */
.landing {
  --tinta: #16233b;
  --kertas: #f5f7fa;
  --garis: #d9dfe7;
  --redup: #4a5568;
  --aksen: #0b6e72;

  min-height: 100vh;
  background: var(--kertas);
  color: var(--tinta);
  font-family: 'Instrument Sans Variable', system-ui, sans-serif;
  line-height: 1.6;
}
h1,
h2,
.logo-teks {
  font-family: 'Source Serif 4 Variable', Georgia, serif;
}

.hero {
  padding: 2.5rem 1rem 2rem;
  background: #fff;
  text-align: center;
}
.logo {
  max-width: 100%;
  max-height: 90px;
  margin: 0 auto 1rem;
}
.logo-teks {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}
h1 {
  margin: 0 0 0.6rem;
  font-size: 1.9rem;
  line-height: 1.15;
  overflow-wrap: anywhere;
}
.sub {
  max-width: 34ch;
  margin: 0 auto;
  color: var(--redup);
  font-size: 1rem;
}

.blok {
  padding: 2rem 0;
  border-top: 1px solid var(--garis);
}
.isi {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}
h2 {
  margin: 0 0 1rem;
  font-size: 1.15rem;
  line-height: 1.3;
}
.narasi {
  max-width: 62ch;
  margin: 0;
}

.status {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--redup);
}
.status button {
  padding: 0.6rem 1.2rem;
  border: 0;
  border-radius: 8px;
  background: var(--tinta);
  color: #fff;
  cursor: pointer;
}

.kaki {
  padding: 1.5rem 1rem;
  border-top: 1px solid var(--garis);
  color: var(--redup);
  font-size: 0.85rem;
  text-align: center;
}

/* Tablet */
@media (min-width: 641px) {
  .hero {
    padding: 3.5rem 1.5rem 2.5rem;
  }
  .logo {
    max-height: 110px;
  }
  h1 {
    font-size: 2.4rem;
  }
  .sub {
    max-width: 44ch;
    font-size: 1.1rem;
  }
  .blok {
    padding: 2.5rem 0;
  }
  .isi {
    padding: 0 1.5rem;
  }
  h2 {
    font-size: 1.25rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .hero {
    padding: 4.5rem 2rem 3rem;
  }
  .logo {
    max-height: 130px;
  }
  h1 {
    font-size: 3rem;
  }
  .sub {
    max-width: none;
    font-size: 1.2rem;
  }
  .blok {
    padding: 3rem 0;
  }
  .isi {
    max-width: 900px;
    padding: 0 2rem;
  }
  h2 {
    font-size: 1.4rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .hero {
    padding: 5.5rem 2.5rem 3.5rem;
  }
  .logo {
    max-height: 150px;
  }
  h1 {
    font-size: 3.4rem;
  }
  .sub {
    font-size: 1.25rem;
  }
  .blok {
    padding: 4rem 0;
  }
  .isi {
    max-width: 1100px;
    padding: 0 2.5rem;
  }
  h2 {
    font-size: 1.5rem;
  }
}
</style>