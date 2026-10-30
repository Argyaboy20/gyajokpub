<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import {
  MessagesSquare,
  SearchCheck,
  Wallet,
  Send,
  ClipboardCheck,
  HandCoins,
  FileBadge,
  PartyPopper,
} from 'lucide-vue-next'
import { vMuncul } from '@/utils/muncul'

const LANGKAH = [
  { judul: 'Konsultasi kebutuhan', ikon: MessagesSquare },
  { judul: 'Cek scope jurnal', ikon: SearchCheck },
  { judul: 'Pembayaran DP 50%', ikon: Wallet },
  { judul: 'Submit artikel', ikon: Send },
  { judul: 'Proses review/revisi', ikon: ClipboardCheck },
  { judul: 'Pelunasan sisa DP', ikon: HandCoins },
  { judul: 'LoA terbit dan diserahkan ke customer', ikon: FileBadge },
  { judul: 'Publish selesai', ikon: PartyPopper },
]

const lintasan = ref(null)
const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let menunggu = false
let pengamatUkuran = null

// Menghitung panjang garis dan seberapa jauh garis "terisi" sesuai posisi scroll
function hitung() {
  menunggu = false
  const el = lintasan.value
  if (!el) return
  const simpul = el.querySelectorAll('.simpul')
  if (simpul.length < 2) return

  const tengah = (n) => {
    const r = n.getBoundingClientRect()
    return r.top + r.height / 2
  }
  const dasar = el.getBoundingClientRect()
  const y0 = tengah(simpul[0])
  const y1 = tengah(simpul[simpul.length - 1])
  const acuan = window.innerHeight * 0.6
  const progres = kurangiGerak ? 1 : Math.min(1, Math.max(0, (acuan - y0) / (y1 - y0)))

  el.style.setProperty('--mulai', `${y0 - dasar.top}px`)
  el.style.setProperty('--panjang', `${y1 - y0}px`)
  el.style.setProperty('--progres', progres.toFixed(3))
  el.querySelectorAll('.langkah').forEach((li, i) => {
    li.classList.toggle('lewat', kurangiGerak || tengah(simpul[i]) < acuan)
  })
}

function jadwalkan() {
  if (menunggu) return
  menunggu = true
  requestAnimationFrame(hitung)
}

onMounted(() => {
  hitung()
  window.addEventListener('resize', jadwalkan)
  if (!kurangiGerak) window.addEventListener('scroll', jadwalkan, { passive: true })
  pengamatUkuran = new ResizeObserver(jadwalkan)
  pengamatUkuran.observe(lintasan.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', jadwalkan)
  window.removeEventListener('scroll', jadwalkan)
  pengamatUkuran?.disconnect()
})
</script>

<template>
  <ol ref="lintasan" class="lintasan">
    <li v-for="(l, i) in LANGKAH" :key="l.judul" class="langkah">
      <span class="simpul" aria-hidden="true">{{ i + 1 }}</span>
      <div v-muncul class="isi-langkah">
        <div class="kartu">
          <span class="ikon"><component :is="l.ikon" :size="22" aria-hidden="true" /></span>
          <div class="teks">
            <small>Langkah {{ i + 1 }}</small>
            <h3>{{ l.judul }}</h3>
          </div>
        </div>
      </div>
    </li>
  </ol>
</template>

<style scoped>
/* Mobile (<641px) = default: garis di kiri, kartu di kanan */
.lintasan {
  --x: 22px;

  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}
.lintasan::before,
.lintasan::after {
  content: '';
  position: absolute;
  left: calc(var(--x) - 2px);
  top: var(--mulai, 0px);
  width: 4px;
  border-radius: 4px;
}
.lintasan::before {
  height: var(--panjang, 0px);
  background: var(--garis);
}
.lintasan::after {
  height: calc(var(--panjang, 0px) * var(--progres, 0));
  background: linear-gradient(180deg, var(--navy-700), var(--teal-600) 70%, var(--emas));
}

.langkah {
  position: relative;
  margin-bottom: 1rem;
  padding-left: 3.6rem;
}
.langkah:last-child {
  margin-bottom: 0;
}

.simpul {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 3px solid var(--garis);
  border-radius: 50%;
  background: #fff;
  color: var(--redup);
  font-weight: 800;
  transform: translateY(-50%);
  transition:
    background 0.4s ease,
    border-color 0.4s ease,
    color 0.4s ease,
    box-shadow 0.4s ease,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.langkah.lewat .simpul {
  border-color: var(--emas);
  background: var(--gradien);
  color: #fff;
  box-shadow: 0 0 0 5px rgba(212, 169, 74, 0.25);
  transform: translateY(-50%) scale(1.08);
}

.kartu {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 1rem;
  border: 1px solid var(--garis);
  border-radius: 14px;
  background: #fff;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}
.kartu:hover {
  transform: translateY(-3px);
  border-color: var(--teal-600);
  box-shadow: var(--bayangan);
}
.ikon {
  display: grid;
  flex: none;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #e4edf9;
  color: var(--navy-700);
  transition:
    background 0.4s ease,
    color 0.4s ease;
}
.langkah.lewat .ikon {
  background: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  color: #fff;
}
small {
  color: var(--redup);
  font-size: 0.75rem;
}
h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

/* Langkah terakhir dirayakan */
.langkah:last-child .kartu {
  background: linear-gradient(135deg, #fff 50%, #fbf3dc);
  border-color: var(--emas);
}
.langkah:last-child.lewat .ikon {
  background: linear-gradient(135deg, #c9962f, #efd078);
  color: var(--navy-900);
}
.langkah:last-child.lewat .ikon svg {
  animation: goyang 1.2s ease 0.2s;
}
@keyframes goyang {
  0%,
  100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-16deg) scale(1.15);
  }
  50% {
    transform: rotate(14deg) scale(1.15);
  }
  75% {
    transform: rotate(-7deg);
  }
}

/* Tablet */
@media (min-width: 641px) {
  .langkah {
    padding-left: 4rem;
    margin-bottom: 1.1rem;
  }
  .kartu {
    padding: 0.9rem 1.2rem;
  }
  h3 {
    font-size: 1.05rem;
  }
}

/* Desktop: garis di tengah, kartu bergantian kiri dan kanan */
@media (min-width: 768px) {
  .lintasan {
    --x: 50%;

    max-width: 860px;
    margin: 0 auto;
  }
  .langkah {
    width: 50%;
    margin-bottom: 1.25rem;
    padding: 0 3.25rem 0 0;
  }
  .langkah:nth-child(even) {
    margin-left: 50%;
    padding: 0 0 0 3.25rem;
  }
  .simpul {
    right: -22px;
    left: auto;
  }
  .langkah:nth-child(even) .simpul {
    right: auto;
    left: -22px;
  }
  .langkah:nth-child(odd) .isi-langkah.muncul:not(.tampil) {
    transform: translateX(-40px);
  }
  .langkah:nth-child(even) .isi-langkah.muncul:not(.tampil) {
    transform: translateX(40px);
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .lintasan {
    max-width: 960px;
  }
  .langkah {
    padding-right: 3.75rem;
  }
  .langkah:nth-child(even) {
    padding-left: 3.75rem;
  }
}
</style>