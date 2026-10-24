<script setup>
defineProps({
  foto: { type: Array, required: true },
  bentuk: { type: String, default: 'persegi' }, // 'bebas' | 'persegi'
  label: { type: String, default: 'Foto' },
})
const emit = defineEmits(['buka'])
</script>

<template>
  <ul class="galeri" :class="bentuk">
    <li v-for="(f, i) in foto" :key="f.id">
      <figure class="kartu">
        <button type="button" class="bingkai" @click="emit('buka', i)">
          <img
            :src="f.url"
            :alt="f.keterangan || `${label} ${i + 1}`"
            loading="lazy"
            decoding="async"
            :style="bentuk === 'bebas' && f.lebar ? { aspectRatio: f.lebar + ' / ' + f.tinggi } : null"
          />
        </button>
        <figcaption v-if="f.keterangan">{{ f.keterangan }}</figcaption>
      </figure>
    </li>
  </ul>
</template>

<style scoped>
/* Mobile (<641px) = default */
.galeri {
  margin: 0;
  padding: 0;
  list-style: none;
}
.bebas {
  column-count: 2;
  column-gap: 0.7rem;
}
.bebas li {
  break-inside: avoid;
  margin-bottom: 0.7rem;
}
.persegi {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}
.kartu {
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--garis);
  border-radius: 12px;
  background: #fff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.kartu:hover {
  transform: translateY(-2px);
  box-shadow: var(--bayangan);
}
.bingkai {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: #f1f6f9;
  cursor: zoom-in;
}
.bingkai:focus-visible {
  outline-offset: -3px;
}
img {
  display: block;
  width: 100%;
  height: auto;
}
.persegi img {
  aspect-ratio: 1 / 1;
  object-fit: contain; /* foto tidak terpotong agar harga tetap terbaca */
}
figcaption {
  padding: 0.55rem 0.7rem 0.7rem;
  border-top: 1px solid var(--garis);
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

/* Tablet */
@media (min-width: 641px) {
  .bebas {
    column-count: 3;
    column-gap: 0.9rem;
  }
  .bebas li {
    margin-bottom: 0.9rem;
  }
  .persegi {
    gap: 0.9rem;
  }
  figcaption {
    font-size: 0.9rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .persegi {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.1rem;
  }
  .bebas {
    column-gap: 1.1rem;
  }
  .bebas li {
    margin-bottom: 1.1rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .bebas {
    column-count: 4;
  }
  .persegi {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>