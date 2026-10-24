<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, LockKeyhole, KeyRound, Eye, EyeOff, ShieldCheck, LoaderCircle, CircleAlert } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { buatTurnstile } from '@/utils/turnstile'
import LOGO from '../../../assets/logogyajokpub.png'

const auth = useAuthStore()
const router = useRouter()

const logoGagal = ref(false)

const email = ref('')
const password = ref('')
const kodeAkses = ref('')
const lihatPassword = ref(false)
const lihatKode = ref(false)
const error = ref('')
const memuat = ref(false)

// Kode akses hanya angka
watch(kodeAkses, (v) => {
  const bersih = v.replace(/\D/g, '')
  if (bersih !== v) kodeAkses.value = bersih
})

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
    <section class="merek">
      <div class="chip">
        <img v-if="!logoGagal" :src="LOGO" alt="GyaJokPub" @error="logoGagal = true" />
        <span v-else>GyaJokPub</span>
      </div>
      <h1>Publication Made Simpler</h1>
      <p>Area khusus admin untuk mengelola konten halaman publik GyaJokPub.</p>
      <p class="poin">
        <ShieldCheck :size="18" aria-hidden="true" />
        Akses dilindungi kode akses dan verifikasi keamanan
      </p>
    </section>

    <div class="sisi">
      <form class="kartu" @submit.prevent="kirim">
        <div class="judul">
          <h2>Masuk ke dashboard</h2>
          <p>Gunakan akun admin yang terdaftar.</p>
        </div>

        <div class="bidang">
          <label for="email">Email</label>
          <div class="kolom">
            <Mail class="ikon" :size="18" aria-hidden="true" />
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="username"
              placeholder="nama@email.com"
              required
              maxlength="200"
            />
          </div>
        </div>

        <div class="bidang">
          <label for="password">Password</label>
          <div class="kolom">
            <LockKeyhole class="ikon" :size="18" aria-hidden="true" />
            <input
              id="password"
              v-model="password"
              :type="lihatPassword ? 'text' : 'password'"
              class="dengan-mata"
              autocomplete="current-password"
              placeholder="Password"
              required
              maxlength="72"
            />
            <button
              type="button"
              class="mata"
              :aria-label="lihatPassword ? 'Sembunyikan password' : 'Tampilkan password'"
              :aria-pressed="lihatPassword"
              @click="lihatPassword = !lihatPassword"
            >
              <EyeOff v-if="lihatPassword" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </div>
        </div>

        <div class="bidang">
          <label for="kode">Kode akses (6 digit)</label>
          <div class="kolom">
            <KeyRound class="ikon" :size="18" aria-hidden="true" />
            <input
              id="kode"
              v-model="kodeAkses"
              :type="lihatKode ? 'text' : 'password'"
              class="dengan-mata"
              inputmode="numeric"
              autocomplete="off"
              placeholder="6 digit angka"
              pattern="\d{6}"
              maxlength="6"
              required
            />
            <button
              type="button"
              class="mata"
              :aria-label="lihatKode ? 'Sembunyikan kode akses' : 'Tampilkan kode akses'"
              :aria-pressed="lihatKode"
              @click="lihatKode = !lihatKode"
            >
              <EyeOff v-if="lihatKode" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </div>
        </div>

        <div ref="kotakTurnstile"></div>

        <p v-if="error" class="galat" role="alert">
          <CircleAlert :size="18" aria-hidden="true" />
          <span>{{ error }}</span>
        </p>

        <button type="submit" class="masuk" :disabled="memuat">
          <LoaderCircle v-if="memuat" class="putar" :size="18" aria-hidden="true" />
          {{ memuat ? 'Memproses…' : 'Masuk' }}
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped>
/* Mobile (<641px) = default: pita gradien di atas, kartu menumpang di bawahnya */
.login {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--kertas);
}
.merek {
  padding: 2rem 1.25rem 4.5rem;
  background:
    radial-gradient(circle at 88% 8%, rgba(255, 255, 255, 0.14), transparent 42%),
    var(--gradien);
  color: #fff;
  text-align: center;
}
.chip {
  display: inline-grid;
  place-items: center;
  margin-bottom: 1.25rem;
  padding: 0.9rem 1.4rem; 
  border-radius: 16px;
  background: #fff;
}
.chip img {
  display: block;
  max-height: 84px;
}
.chip span {
  color: var(--navy-900);
  font-family: var(--font-judul);
  font-weight: 700;
  font-size: 1.4rem;
}
.merek h1 {
  margin: 0 0 0.4rem;
  font-family: var(--font-judul);
  font-size: 1rem;
  line-height: 1.2;
}
.merek p {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.92;
}
.poin {
  display: none !important;
}

.sisi {
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 0 1rem 2rem;
}
.kartu {
  display: grid;
  gap: 1rem;
  width: 100%;
  max-width: 420px;
  align-self: flex-start;
  margin-top: -2.75rem;
  padding: 1.5rem 1.25rem;
  border: 1px solid var(--garis);
  border-radius: 18px;
  background: var(--permukaan);
  box-shadow: var(--bayangan);
}
.judul h2 {
  margin: 0;
  font-family: var(--font-judul);
  font-size: 1.25rem;
}
.judul p {
  margin: 0.15rem 0 0;
  color: var(--redup);
  font-size: 0.9rem;
}

.bidang {
  display: grid;
  gap: 0.35rem;
}
label {
  font-size: 0.875rem;
  font-weight: 600;
}
.kolom {
  position: relative;
  display: flex;
  align-items: center;
}
.ikon {
  position: absolute;
  left: 0.85rem;
  color: var(--redup);
  pointer-events: none;
}
input {
  width: 100%;
  min-width: 0;
  height: 46px;
  padding: 0 0.9rem 0 2.6rem;
  border: 1px solid #c4d2de;
  border-radius: 10px;
  background: #fff;
  color: var(--tinta);
  font-size: 1rem; /* minimal 16px agar iOS tidak memperbesar layar */
}
input.dengan-mata {
  padding-right: 3rem;
}
input::placeholder {
  color: #8a98ab;
}
input:focus {
  border-color: var(--aksen);
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px #fff inset;
  -webkit-text-fill-color: var(--tinta);
}
.mata {
  position: absolute;
  right: 0.3rem;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--redup);
  cursor: pointer;
}
.mata:hover {
  background: var(--kertas);
  color: var(--tinta);
}

.galat {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0;
  padding: 0.65rem 0.8rem;
  border: 1px solid #f3c1bd;
  border-radius: 10px;
  background: #fdecea;
  color: #8c1d18;
  font-size: 0.9rem;
}
.galat svg {
  flex: none;
  margin-top: 0.1rem;
}

.masuk {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 48px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px -10px rgba(11, 36, 71, 0.6);
  transition:
    filter 0.2s ease,
    transform 0.1s ease;
}
.masuk:hover:not(:disabled) {
  filter: brightness(1.1);
}
.masuk:active:not(:disabled) {
  transform: scale(0.99);
}
.masuk:disabled {
  opacity: 0.7;
  cursor: wait;
}
.putar {
  animation: putar 0.8s linear infinite;
}
@keyframes putar {
  to {
    transform: rotate(360deg);
  }
}

/* Tablet */
@media (min-width: 641px) {
  .merek {
    padding: 2.75rem 1.5rem 5.25rem;
  }
  .merek h1 {
    font-size: 1.3rem;
  }
  .chip img { 
    max-height: 100px; 
  }
  .merek p {
    font-size: 1rem;
  }
  .kartu {
    padding: 2rem;
  }
  .judul h2 {
    font-size: 1.4rem;
  }
}

/* Desktop: dua kolom, panel merek di kiri dan formulir di kanan */
@media (min-width: 768px) {
  .login {
    flex-direction: row;
  }
  .merek {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 3rem;
    text-align: left;
  }
  .merek h1 {
    font-size: 1.5rem;
  }
  .chip img { 
    max-height: 120px; 
  }
  .merek p {
    max-width: 34ch;
  }
  .poin {
    display: flex !important;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.5rem !important;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    font-size: 0.9rem !important;
  }
  .sisi {
    align-items: center;
    padding: 2rem;
  }
  .kartu {
    align-self: center;
    margin-top: 0;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .merek {
    padding: 4rem 5rem;
  }
  .merek h1 {
    font-size: 1.75rem;
  }
  .chip img { 
    max-height: 140px; 
  }
  .kartu {
    max-width: 460px;
    padding: 2.25rem;
  }
}
</style>