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
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
}
a {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--garis, #d9dfe7);
  border-radius: 8px;
  background: #fff;
  color: var(--tinta, #16233b);
  font-weight: 600;
  text-decoration: none;
}
a:hover {
  background: var(--tinta, #16233b);
  border-color: var(--tinta, #16233b);
  color: #fff;
}
a:focus-visible {
  outline: 3px solid var(--aksen, #0b6e72);
  outline-offset: 2px;
}

/* Tablet */
@media (min-width: 641px) {
  .daftar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  a {
    padding: 0.75rem 1.25rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .daftar {
    gap: 1rem;
  }
  a {
    padding: 0.85rem 1.5rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  a {
    padding: 0.95rem 1.75rem;
    font-size: 1.05rem;
  }
}
</style>