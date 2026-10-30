<script setup>
import {
  HeartHandshake,
  RefreshCw,
  LayoutTemplate,
  MonitorCheck,
  BadgeCheck,
  ShieldCheck,
  Eye,
  Zap,
  Wallet,
  Check,
} from 'lucide-vue-next'
import { vMuncul } from '@/utils/muncul'

const KEUNGGULAN = [
  { judul: 'Pendampingan sampai terbit', ikon: HeartHandshake, warna: 'biru' },
  { judul: 'Free revisi', ikon: RefreshCw, warna: 'teal' },
  { judul: 'Free penyesuaian template', ikon: LayoutTemplate, warna: 'emas' },
  { judul: 'Akan diberikan akun OJS jurnalnya agar bisa dipantau customer', ikon: MonitorCheck, warna: 'biru' },
  { judul: 'LoA resmi dari jurnal', ikon: BadgeCheck, warna: 'teal' },
  { judul: 'Jurnal sesuai scope (bukan predator)', ikon: ShieldCheck, warna: 'emas' },
  { judul: 'Proses transparan', ikon: Eye, warna: 'biru' },
  { judul: 'Fasttrack tersedia', catatan: 'Untuk Sinta 3 s/d 6 dan non Sinta', ikon: Zap, warna: 'emas', istimewa: true },
  { judul: 'Harga terjangkau', ikon: Wallet, warna: 'teal' },
]
</script>

<template>
  <ul class="daftar">
    <li v-for="(k, i) in KEUNGGULAN" :key="k.judul" v-muncul="{ jeda: (i % 3) * 110 }">
      <div class="kartu" :class="[k.warna, { istimewa: k.istimewa }]">
        <span class="centang" aria-hidden="true"><Check :size="13" /></span>
        <span class="ikon" v-muncul="{ arah: 'pop', jeda: 200 }">
          <component :is="k.ikon" :size="24" aria-hidden="true" />
        </span>
        <div class="teks">
          <h3>{{ k.judul }}</h3>
          <p v-if="k.catatan">{{ k.catatan }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
/* Mobile (<641px) = default: satu kolom */
.daftar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.daftar > li {
  display: flex;
}
.kartu {
  --warna: var(--navy-700);
  --latar: #e4edf9;

  position: relative;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 0.9rem 2.6rem 0.9rem 1rem;
  border: 1px solid var(--garis);
  border-radius: 14px;
  background: #fff;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}
.kartu.teal {
  --warna: var(--teal-600);
  --latar: #ddf2ef;
}
.kartu.emas {
  --warna: #a97c12;
  --latar: #faf0d3;
}
.kartu:hover {
  transform: translateY(-4px);
  border-color: var(--warna);
  box-shadow: var(--bayangan);
}
.ikon {
  display: grid;
  flex: none;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--latar);
  color: var(--warna);
}
.centang {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--teal-600), #34b5a8);
  color: #fff;
}
h3 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.35;
}
p {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Kartu Fasttrack disorot */
.kartu.istimewa {
  border-color: transparent;
  background:
    radial-gradient(circle at 90% 0%, rgba(255, 255, 255, 0.16), transparent 45%),
    var(--gradien);
  color: #fff;
}
.kartu.istimewa .ikon {
  background: rgba(255, 255, 255, 0.16);
  color: var(--emas);
}
.kartu.istimewa .centang {
  background: var(--emas);
  color: var(--navy-900);
}
.kartu.istimewa p {
  color: rgba(255, 255, 255, 0.88);
}

/* Tablet: dua kolom */
@media (min-width: 641px) {
  .daftar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }
}

/* Desktop: tiga kolom (3 x 3) */
@media (min-width: 768px) {
  .daftar {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
  .kartu {
    padding: 1rem 2.6rem 1rem 1.1rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .daftar {
    gap: 1.25rem;
  }
  .ikon {
    width: 54px;
    height: 54px;
  }
  h3 {
    font-size: 1.05rem;
  }
}
</style>