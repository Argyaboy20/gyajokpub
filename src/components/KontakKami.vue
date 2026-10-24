<script setup>
import { computed } from 'vue'
import { Mail } from 'lucide-vue-next'
import BrandIcon from './BrandIcon.vue'

const props = defineProps({ kontak: { type: Array, default: () => [] } })

const URUTAN = [
  { jenis: 'WA', label: 'WhatsApp' },
  { jenis: 'EMAIL', label: 'Email' },
  { jenis: 'THREAD', label: 'Threads' },
  { jenis: 'X', label: 'X' },
  { jenis: 'IG', label: 'Instagram' },
]

const tampil = computed(() =>
  URUTAN.map((u) => ({ ...u, url: props.kontak.find((k) => k.jenis === u.jenis)?.url })).filter(
    (u) => typeof u.url === 'string' && /^(https:|mailto:)/.test(u.url),
  ),
)
</script>

<template>
  <ul class="daftar">
    <li v-for="k in tampil" :key="k.jenis">
      <a :href="k.url" target="_blank" rel="noopener noreferrer">
        <Mail v-if="k.jenis === 'EMAIL'" :size="22" aria-hidden="true" />
        <BrandIcon v-else :nama="k.jenis" :ukuran="22" />
        <span>{{ k.label }}</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
/* Mobile (<641px) = default */
.daftar {
  display: grid;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
a {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: #fff;
  color: var(--navy-900);
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 6px 16px -10px rgba(0, 0, 0, 0.5);
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}
a:hover {
  background: var(--emas);
  transform: translateY(-2px);
}
a:focus-visible {
  outline-color: #fff;
}

/* Tablet */
@media (min-width: 641px) {
  .daftar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  a {
    padding: 0.8rem 1.35rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .daftar {
    gap: 1rem;
  }
  a {
    padding: 0.9rem 1.6rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  a {
    padding: 1rem 1.9rem;
    font-size: 1.05rem;
  }
}
</style>