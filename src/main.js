import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { pasangAuth } from './api/http'
import '@fontsource-variable/source-serif-4'
import '@fontsource-variable/instrument-sans'
import './styles/tema.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const auth = useAuthStore(pinia)
pasangAuth({ token: () => auth.token, tidakSah: () => auth.keluar() })
if (auth.masuk) auth.perpanjang() // sesi dari reload: segarkan token dan validasi akun

app.use(router)
app.mount('#app')