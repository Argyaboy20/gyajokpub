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
      <button type="button" class="bingkai" @click="emit('buka', i)">
        <img
          :src="f.url"
          :alt="`${label} ${i + 1}`"
          loading="lazy"
          decoding="async"
          :style="bentuk === 'bebas' && f.lebar ? { aspectRatio: f.lebar + ' / ' + f.tinggi } : null"
        />
      </button>
    </li>
  </ul>
</template>

<style scoped>
/* Mobile (<641px) = default */
.galeri {
  list-style: none;
  margin: 0;
  padding: 0;
}
.bebas {
  column-count: 2;
  column-gap: 0.6rem;
}
.bebas li {
  break-inside: avoid;
  margin-bottom: 0.6rem;
}
.persegi {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}
.bingkai {
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid var(--garis, #d9dfe7);
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  cursor: zoom-in;
}
.bingkai:focus-visible {
  outline: 3px solid var(--aksen, #0b6e72);
  outline-offset: 2px;
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

/* Tablet */
@media (min-width: 641px) {
  .bebas {
    column-count: 3;
    column-gap: 0.8rem;
  }
  .bebas li {
    margin-bottom: 0.8rem;
  }
  .persegi {
    gap: 0.8rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .persegi {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
  .bebas {
    column-gap: 1rem;
  }
  .bebas li {
    margin-bottom: 1rem;
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