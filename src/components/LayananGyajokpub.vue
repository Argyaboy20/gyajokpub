<script setup>
import { Award, Library, Globe, PenLine, ArrowRightLeft, MessagesSquare } from 'lucide-vue-next'
import { vMuncul } from '@/utils/muncul'

const LAYANAN = [
  { judul: 'Publikasi jurnal Sinta 1 – 6', ikon: Award, warna: 'biru' },
  { judul: 'Publikasi jurnal nasional non-Sinta', ikon: Library, warna: 'teal' },
  { judul: 'Publikasi jurnal internasional non-Sinta', ikon: Globe, warna: 'emas' },
  { judul: 'Pembuatan artikel ilmiah dari nol', ikon: PenLine, warna: 'biru' },
  { judul: 'Convert skripsi ke artikel jurnal', ikon: ArrowRightLeft, warna: 'teal' },
  { judul: 'Konsultasi pemilihan jurnal', ikon: MessagesSquare, warna: 'emas' },
]
</script>

<template>
  <ul class="daftar">
    <li v-for="(l, i) in LAYANAN" :key="l.judul" v-muncul="{ jeda: (i % 3) * 120 }">
      <div class="kartu" :class="l.warna">
        <span class="ikon"><component :is="l.ikon" :size="26" aria-hidden="true" /></span>
        <h3>{{ l.judul }}</h3>
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
  --latar: #e9f0fa;
  --ikon: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  --ikon-teks: #fff;

  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--garis);
  border-left: 5px solid var(--warna);
  border-radius: 14px;
  background: linear-gradient(135deg, #fff 55%, var(--latar));
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}
.kartu.teal {
  --warna: var(--teal-600);
  --latar: #e3f4f1;
  --ikon: linear-gradient(135deg, var(--teal-600), #34b5a8);
}
.kartu.emas {
  --warna: var(--emas);
  --latar: #fbf3dc;
  --ikon: linear-gradient(135deg, #c9962f, #efd078);
  --ikon-teks: var(--navy-900);
}
.kartu:hover {
  transform: translateY(-4px);
  box-shadow: var(--bayangan);
}
.ikon {
  display: grid;
  flex: none;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--ikon);
  color: var(--ikon-teks);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.kartu:hover .ikon {
  transform: rotate(-8deg) scale(1.1);
}
h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
}

/* Tablet: dua kolom */
@media (min-width: 641px) {
  .daftar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }
}

/* Desktop: tiga kolom */
@media (min-width: 768px) {
  .daftar {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
  .kartu {
    padding: 1rem 1.1rem;
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