<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { buatTurnstile } from '@/utils/turnstile'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const kodeAkses = ref('')
const error = ref('')
const memuat = ref(false)
const kotakTurnstile = ref(null)
  let turnstile = null
  onMounted(() => {
    turnstile = buatTurnstile(kotakTurnstile.value)
  })
  onUnmounted(() => turnstile?.hancurkan())

async function kirim() {
  if (memuat.value) return
  error.value = ''
  memuat.value = true
  try {
    const tt = turnstile ? await turnstile.ambilToken() : ''
    await auth.login(email.value, password.value, kodeAkses.value, tt)
    password.value = ''
    kodeAkses.value = ''
    router.replace({ name: 'dashboard' })
  } catch (e) {
    error.value = e.message
  } finally {
    memuat.value = false
  }
}
</script>

<template>
  <main class="login">
    <form class="kartu" @submit.prevent="kirim">
      <h1>Admin GyaJokPub</h1>

      <label>
        Email
        <input v-model="email" type="email" autocomplete="username" required maxlength="200" />
      </label>

      <label>
        Password
        <input v-model="password" type="password" autocomplete="current-password" required maxlength="72" />
      </label>

      <label>
        Kode akses (6 digit)
        <input
          v-model="kodeAkses"
          type="password"
          inputmode="numeric"
          autocomplete="off"
          pattern="\d{6}"
          maxlength="6"
          required
        />
      </label>

      <div ref="kotakTurnstile"></div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <button type="submit" :disabled="memuat">{{ memuat ? 'Memproses…' : 'Masuk' }}</button>
    </form>
  </main>
</template>

<style scoped>
/* Mobile (<641px) = default */
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  font-family: sans-serif;
}
.kartu {
  width: 100%;
  max-width: 100%;
  display: grid;
  gap: 0.9rem;
  padding: 1.25rem;
  border: 1px solid #ddd;
  border-radius: 12px;
}
h1 {
  margin: 0;
  font-size: 1.25rem;
}
label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}
input {
  width: 100%;
  min-width: 0;
  padding: 0.6rem;
  border: 1px solid #bbb;
  border-radius: 8px;
  font-size: 1rem;
}
button {
  padding: 0.7rem;
  border: 0;
  border-radius: 8px;
  background: #111;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.error {
  margin: 0;
  color: #b00020;
  font-size: 0.9rem;
}

/* Tablet */
@media (min-width: 641px) {
  .kartu {
    max-width: 400px;
    padding: 1.75rem;
  }
  h1 {
    font-size: 1.4rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .kartu {
    max-width: 420px;
    padding: 2rem;
    gap: 1rem;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .kartu {
    max-width: 440px;
  }
  h1 {
    font-size: 1.5rem;
  }
}
</style>