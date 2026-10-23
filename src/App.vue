<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

// Sesi berakhir saat sedang di halaman admin: kembali ke beranda
watch(
  () => auth.masuk,
  (masuk) => {
    if (!masuk && route.meta.admin) router.replace({ name: 'landing' })
  },
)
</script>

<template>
  <RouterView />
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
}
img {
  max-width: 100%;
}
</style>