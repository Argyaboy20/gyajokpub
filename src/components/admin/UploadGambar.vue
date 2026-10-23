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
      <Upload :size="20" aria-hidden="true" />
      <span>{{ memuat ? 'Mengunggah…' : 'Pilih foto (maks 10 sekali upload, maks 8 MB per foto)' }}</span>
      <input class="sembunyi" type="file" accept="image/*" multiple :disabled="memuat" @change="saatPilih" />
    </label>
    <p v-if="pesan" class="error" role="alert">{{ pesan }}</p>
  </div>
</template>

<style scoped>
/* Mobile (<641px) = default */
.zona {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem;
  border: 2px dashed #bbb;
  border-radius: 12px;
  font-size: 0.85rem;
  text-align: center;
  cursor: pointer;
  position: relative;
}
.zona:focus-within {
  outline: 2px solid #111;
}
.zona.nonaktif {
  opacity: 0.6;
  cursor: wait;
}
.sembunyi {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: inherit;
}
.error {
  margin: 0.5rem 0 0;
  color: #b00020;
  font-size: 0.85rem;
}

/* Tablet */
@media (min-width: 641px) {
  .zona {
    padding: 1.2rem;
    font-size: 0.9rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .zona {
    padding: 1.6rem;
    font-size: 1rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .zona {
    padding: 2rem;
  }
}
</style>