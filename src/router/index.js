import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'landing', component: () => import('@/views/LandingPage.vue') },
    {
      path: '/loginadmin',
      name: 'login-admin',
      component: () => import('@/views/admin/LoginAdmin.vue'),
      meta: { tamu: true },
    },
    {
      path: '/admin/dashboard',
      name: 'dashboard',
      component: () => import('@/views/admin/Dashboard.vue'),
      meta: { admin: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  // Tanpa sesi, halaman admin dialihkan ke beranda (tidak membocorkan alamat login)
  if (to.meta.admin && !auth.masuk) return { name: 'landing' }
  if (to.meta.tamu && auth.masuk) return { name: 'dashboard' }
})

export default router