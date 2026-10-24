<script setup>
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'

defineProps({ memuat: Boolean })
const emit = defineEmits(['pilih'])

const pesan = ref('')
const MAKS_BYTE = 8 * 1024 * 1024
const MAKS_FILE = 10

function saatPilih(e) {
  pesan.value = ''
  const files = Array.from(e.target.files ?? [])
  e.target.value = '' // agar file yang sama bisa dipilih ulang
  if (!files.length) return
  if (files.length > MAKS_FILE) {
    pesan.value = `Maksimal ${MAKS_FILE} foto sekali upload`
    return
  }
  if (files.some((f) => !f.type.startsWith('image/'))) {
    pesan.value = 'Hanya file gambar yang diperbolehkan'
    return
  }
  if (files.some((f) => f.size > MAKS_BYTE)) {
    pesan.value = 'Ada foto yang lebih dari 8 MB'
    return
  }
  emit('pilih', files)
}
</script>

<template>
  <div>
    <label class="zona" :class="{ nonaktif: memuat }">
      <span class="lingkar"><Upload :size="20" aria-hidden="true" /></span>
      <strong>{{ memuat ? 'Mengunggah…' : 'Pilih foto untuk diunggah' }}</strong>
      <small>Maks 10 foto sekali upload · maks 8 MB per foto</small>
      <input class="sembunyi" type="file" accept="image/*" multiple :disabled="memuat" @change="saatPilih" />
    </label>
    <p v-if="pesan" class="error" role="alert">{{ pesan }}</p>
  </div>
</template>

<style scoped>
/* Mobile (<641px) = default */
.zona {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1.1rem 1rem;
  border: 2px dashed #9fb6c8;
  border-radius: var(--radius);
  background: linear-gradient(180deg, #f8fbfd, #eef5f8);
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}
.zona:hover {
  border-color: var(--aksen);
  background: #eaf5f4;
}
.zona:focus-within {
  outline: 3px solid var(--aksen);
  outline-offset: 2px;
}
.zona.nonaktif {
  opacity: 0.6;
  cursor: wait;
}
.lingkar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--gradien);
  color: #fff;
}
strong {
  font-size: 0.95rem;
}
small {
  color: var(--redup);
  font-size: 0.8rem;
}
.sembunyi {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: inherit;
}
.error {
  margin: 0.5rem 0 0;
  color: var(--bahaya);
  font-size: 0.85rem;
}

/* Tablet */
@media (min-width: 641px) {
  .zona {
    padding: 1.4rem 1.25rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .zona {
    flex-direction: row;
    justify-content: center;
    gap: 0.9rem;
    padding: 1.5rem;
    text-align: left;
  }
  .zona small {
    display: block;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .zona {
    padding: 1.75rem;
  }
  strong {
    font-size: 1rem;
  }
}
</style>