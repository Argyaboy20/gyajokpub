<script setup>
import { computed } from 'vue'
import { siWhatsapp, siInstagram, siX, siThreads } from 'simple-icons'

const props = defineProps({
  nama: { type: String, required: true }, // WA | IG | X | THREAD
  ukuran: { type: Number, default: 20 },
})

const PETA = { WA: siWhatsapp, IG: siInstagram, X: siX, THREAD: siThreads }
const path = computed(() => PETA[props.nama]?.path ?? '')
</script>

<template>
  <svg :width="ukuran" :height="ukuran" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path :d="path" />
  </svg>
</template>