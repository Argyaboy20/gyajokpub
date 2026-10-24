<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  foto: { type: Array, default: () => [] },
  index: { type: Number, default: -1 }, // -1 = tertutup
})
const emit = defineEmits(['tutup', 'ganti'])

const tombolTutup = ref(null)
const terbuka = computed(() => props.index >= 0 && props.index < props.foto.length)

function sebelum() {
  if (props.index > 0) emit('ganti', props.index - 1)
}
function sesudah() {
  if (props.index < props.foto.length - 1) emit('ganti', props.index + 1)
}
function saatTombol(e) {
  if (e.key === 'Escape') emit('tutup')
  else if (e.key === 'ArrowLeft') sebelum()
  else if (e.key === 'ArrowRight') sesudah()
}
function lepas() {
  window.removeEventListener('keydown', saatTombol)
  document.body.style.overflow = ''
}

watch(terbuka, async (buka) => {
  if (buka) {
    window.addEventListener('keydown', saatTombol)
    document.body.style.overflow = 'hidden'
    await nextTick()
    tombolTutup.value?.focus()
  } else {
    lepas()
  }
})
onUnmounted(lepas)
</script>

<template>
  <Teleport to="body">
    <div v-if="terbuka" class="lapisan" role="dialog" aria-modal="true" aria-label="Foto diperbesar" @click.self="emit('tutup')">
      <button ref="tombolTutup" type="button" class="tutup" aria-label="Tutup" @click="emit('tutup')">
        <X :size="24" />
      </button>
      <button v-if="index > 0" type="button" class="panah kiri" aria-label="Foto sebelumnya" @click="sebelum">
        <ChevronLeft :size="26" />
      </button>
      <figure class="figur">
        <img :src="foto[index].url" :alt="foto[index].keterangan || `Foto ${index + 1} dari ${foto.length}`" />
        <figcaption v-if="foto[index].keterangan">{{ foto[index].keterangan }}</figcaption>
      </figure>
      <button v-if="index < foto.length - 1" type="button" class="panah kanan" aria-label="Foto berikutnya" @click="sesudah">
        <ChevronRight :size="26" />
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
/* Mobile (<641px) = default */
.lapisan {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 3.5rem 0.5rem;
  background: rgba(14, 20, 34, 0.94);
}
.figur {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  max-width: 100%;
  margin: 0;
}
.figur img {
  max-width: 100%;
  max-height: calc(100dvh - 12rem);
  object-fit: contain;
}
.figur figcaption {
  max-width: 60ch;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}
.tutup,
.panah {
  position: absolute;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  cursor: pointer;
}
.tutup {
  top: 0.5rem;
  right: 0.5rem;
}
.panah {
  top: 50%;
  transform: translateY(-50%);
}
.kiri {
  left: 0.25rem;
}
.kanan {
  right: 0.25rem;
}
.tutup:focus-visible,
.panah:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 2px;
}

/* Tablet */
@media (min-width: 641px) {
  .lapisan {
    padding: 4rem 4rem;
  }
  .kiri {
    left: 0.75rem;
  }
  .kanan {
    right: 0.75rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .lapisan {
    padding: 4rem 5rem;
  }
  .tutup,
  .panah {
    width: 48px;
    height: 48px;
  }
  .tutup {
    top: 1rem;
    right: 1rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .lapisan {
    padding: 4.5rem 6rem;
  }
  .kiri {
    left: 1.5rem;
  }
  .kanan {
    right: 1.5rem;
  }
}
</style>