<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X, Info, ShieldCheck } from 'lucide-vue-next'

const route = useRoute()
const buka = ref(false)
const tombol = ref(null)

const MENU = [
  { ke: '/about', label: 'About', ikon: Info },
  { ke: '/privacypolicy', label: 'Privacy Policy', ikon: ShieldCheck },
]

function tutup() {
  buka.value = false
}

watch(() => route.path, tutup)
watch(buka, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (!v) tombol.value?.focus()
})

function tekan(e) {
  if (e.key === 'Escape' && buka.value) tutup()
}
function ubahUkuran() {
  if (window.innerWidth >= 768) tutup()
}

onMounted(() => {
  window.addEventListener('keydown', tekan)
  window.addEventListener('resize', ubahUkuran)
})
onUnmounted(() => {
  window.removeEventListener('keydown', tekan)
  window.removeEventListener('resize', ubahUkuran)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="bar">
    <div class="isi">
      <RouterLink to="/" class="merek">GyaJokPub</RouterLink>

      <nav class="tautan" aria-label="Menu utama">
        <RouterLink v-for="m in MENU" :key="m.ke" :to="m.ke">{{ m.label }}</RouterLink>
      </nav>

      <button
        ref="tombol"
        type="button"
        class="hamburger"
        aria-label="Buka menu"
        :aria-expanded="buka"
        aria-controls="menu-samping"
        @click="buka = true"
      >
        <Menu :size="22" aria-hidden="true" />
      </button>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="samping">
      <div v-if="buka" class="lapisan" @click.self="tutup">
        <aside id="menu-samping" class="laci" role="dialog" aria-modal="true" aria-label="Menu">
          <div class="kepala-laci">
            <span class="merek-laci">GyaJokPub</span>
            <button type="button" class="tutup" aria-label="Tutup menu" @click="tutup">
              <X :size="22" aria-hidden="true" />
            </button>
          </div>
          <nav class="daftar" aria-label="Menu samping">
            <RouterLink v-for="m in MENU" :key="m.ke" :to="m.ke" @click="tutup">
              <component :is="m.ikon" :size="20" aria-hidden="true" />
              {{ m.label }}
            </RouterLink>
          </nav>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Mobile (<641px) = default */
.bar {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 40;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background:
    linear-gradient(135deg, rgba(11, 36, 71, 0.62), rgba(15, 118, 110, 0.42)),
    rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.6);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  backdrop-filter: blur(14px) saturate(160%);
}
.isi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 1rem;
}
.merek {
  color: #fff;
  font-family: var(--font-judul);
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
}
.merek:focus-visible,
.tautan a:focus-visible,
.hamburger:focus-visible {
  outline-color: #fff;
}
.tautan {
  display: none;
}
.hamburger {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}
.hamburger:hover {
  background: rgba(255, 255, 255, 0.26);
}

/* Side menu */
.lapisan {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(7, 20, 40, 0.5);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}
.laci {
  position: absolute;
  inset: 0 0 0 auto;
  display: flex;
  flex-direction: column;
  width: min(82vw, 320px);
  padding: 1rem;
  background:
    radial-gradient(circle at 90% 0%, rgba(255, 255, 255, 0.14), transparent 45%), var(--gradien);
  color: #fff;
  box-shadow: -20px 0 40px -20px rgba(0, 0, 0, 0.6);
}
.kepala-laci {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.22);
}
.merek-laci {
  font-family: var(--font-judul);
  font-size: 1.2rem;
  font-weight: 700;
}
.tutup {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  cursor: pointer;
}
.tutup:focus-visible,
.daftar a:focus-visible {
  outline-color: #fff;
}
.daftar {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
}
.daftar a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}
.daftar a:hover,
.daftar a.router-link-active {
  background: rgba(255, 255, 255, 0.22);
}
.daftar a.router-link-active {
  border-color: var(--emas);
}

/* Animasi buka/tutup */
.samping-enter-active,
.samping-leave-active {
  transition: opacity 0.25s ease;
}
.samping-enter-active .laci,
.samping-leave-active .laci {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.samping-enter-from,
.samping-leave-to {
  opacity: 0;
}
.samping-enter-from .laci,
.samping-leave-to .laci {
  transform: translateX(100%);
}

/* Tablet: tetap tombol menu */
@media (min-width: 641px) {
  .isi {
    padding: 0 1.5rem;
  }
}

/* Desktop: tombol menu diganti tombol di kanan */
@media (min-width: 768px) {
  .isi {
    height: 64px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  .hamburger {
    display: none;
  }
  .tautan {
    display: flex;
    gap: 0.5rem;
  }
  .tautan a {
    padding: 0.5rem 1.1rem;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    font-size: 0.92rem;
    font-weight: 600;
    text-decoration: none;
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
  }
  .tautan a:hover {
    background: rgba(255, 255, 255, 0.26);
  }
  .tautan a.router-link-active {
    border-color: var(--emas);
    background: rgba(212, 169, 74, 0.22);
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .isi {
    max-width: 1300px;
    padding: 0 2.5rem;
  }
  .merek {
    font-size: 1.3rem;
  }
}
</style>
