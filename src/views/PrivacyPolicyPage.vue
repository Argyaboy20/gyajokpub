<script setup>
import { RouterLink } from 'vue-router'
import { Info } from 'lucide-vue-next'
import { vMuncul } from '@/utils/muncul'
import NavbarPublik from '@/components/NavbarPublik.vue'

const tahun = new Date().getFullYear()
const DIPERBARUI = '14 November 2026'

const SECTION = [
  {
    judul: 'Ringkasan',
    isi: [
      'Situs GyaJokPub tidak memakai cookies untuk pelacakan atau iklan, tidak membuat profil pengunjung, dan tidak menjual atau membagikan data pengunjung kepada pihak lain untuk kepentingan komersial.',
      'Pengunjung tidak perlu membuat akun atau mengisi formulir data pribadi untuk membuka situs ini.',
    ],
  },
  {
    judul: 'Data yang Kami Terima',
    isi: [
      'Saat situs dibuka, penyedia infrastruktur kami (Cloudflare untuk tampilan situs dan foto, Render untuk server) menerima data teknis standar seperti alamat IP dan jenis browser. Data ini dibutuhkan agar situs dapat dikirim ke perangkat kamu dan dilindungi dari penyalahgunaan.',
      'Server kami memakai alamat IP secara sementara di memori untuk membatasi jumlah permintaan. Data ini tidak disimpan ke database dan hilang saat server dimulai ulang.',
    ],
  },
  // HAPUS objek di bawah ini (dari "{" sampai "},") bila Cloudflare Web Analytics belum aktif
  {
    judul: 'Statistik Kunjungan',
    isi: [
      'Kami memakai Cloudflare Web Analytics untuk mengetahui jumlah kunjungan dan halaman yang dibuka. Layanan ini tidak memakai cookies, tidak membuat sidik jari perangkat, dan tidak melacak pengunjung antar situs.',
    ],
  },
  {
    judul: 'Asisten Chat',
    isi: [
      'Pesan yang kamu tulis di asisten chat dikirim ke layanan AI (Cloudflare Workers AI) untuk menghasilkan jawaban. GyaJokPub tidak menyimpan isi percakapan.',
      'Mohon tidak menuliskan data pribadi atau naskah penelitian di chat. Untuk pembahasan lebih lanjut, hubungi kami lewat kontak resmi.',
    ],
  },
  {
    judul: 'Verifikasi Keamanan',
    isi: [
      'Asisten chat dan halaman login admin dilindungi Cloudflare Turnstile untuk membedakan pengguna dari bot. Proses ini berjalan di browser kamu dan diverifikasi oleh Cloudflare.',
    ],
  },
  {
    judul: 'Tautan ke Pihak Lain',
    isi: [
      'Tombol di bagian Kontak Kami membuka WhatsApp, email, Threads, X, atau Instagram. Setelah kamu berpindah ke layanan tersebut, kebijakan privasi layanan itu yang berlaku.',
    ],
  },
  {
    judul: 'Pembaruan Kebijakan',
    isi: [
      'Kebijakan ini dapat diperbarui sewaktu-waktu mengikuti perubahan layanan. Tanggal pembaruan terakhir tercantum di bagian atas halaman ini.',
    ],
  },
]
</script>

<template>
  <div class="halaman">
    <NavbarPublik />

    <header class="hero">
      <h1>Privacy Policy</h1>
      <p>Terakhir diperbarui: {{ DIPERBARUI }}</p>
    </header>

    <main class="konten">
      <section v-for="(s, i) in SECTION" :key="s.judul" class="panel" :aria-labelledby="'pp-' + i">
        <h2 :id="'pp-' + i" v-muncul="{ arah: i % 2 ? 'kanan' : 'kiri' }">{{ s.judul }}</h2>
        <p v-for="(p, j) in s.isi" :key="j" class="isi">{{ p }}</p>
      </section>

      <div class="lanjut">
        <RouterLink to="/about" class="tombol">
          <Info :size="18" aria-hidden="true" /> About
        </RouterLink>
      </div>
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
  font-size: 0.9rem;
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
  margin: 0 0 0.9rem;
  line-height: 1.75;
  overflow-wrap: anywhere;
}
.isi:last-child {
  margin-bottom: 0;
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
