import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'landing', component: () => import('@/views/LandingPage.vue') },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutPage.vue'),
      meta: { judul: 'GyaJokPub - About' },
    },
    {
      path: '/privacypolicy',
      name: 'privacy-policy',
      component: () => import('@/views/PrivacyPolicyPage.vue'),
      meta: { judul: 'GyaJokPub - Privacy Policy' },
    },
    {
      path: '/loginadmin',
      name: 'login-admin',
      component: () => import('@/views/admin/LoginAdmin.vue'),
      meta: { tamu: true, judul: 'GyaJokPub - Login Admin' },
    },
    {
      path: '/admin/dashboard',
      name: 'dashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
      meta: { admin: true, judul: 'GyaJokPub - Dashboard Admin' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  document.title = to.meta.judul ?? 'GyaJokPub'
  const auth = useAuthStore()
  // Tanpa sesi, halaman admin dialihkan ke beranda (tidak membocorkan alamat login)
  if (to.meta.admin && !auth.masuk) return { name: 'landing' }
  if (to.meta.tamu && auth.masuk) return { name: 'dashboard' }
})

export default router
