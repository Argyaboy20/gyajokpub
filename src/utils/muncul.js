// Direktif v-muncul: elemen beranimasi masuk saat terlihat di layar dan keluar saat meninggalkannya.
let pengamat = null

function ambilPengamat() {
  if (!pengamat) {
    pengamat = new IntersectionObserver(
      (daftar) => {
        for (const e of daftar) e.target.classList.toggle('tampil', e.isIntersecting)
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    )
  }
  return pengamat
}

export const vMuncul = {
  mounted(el, binding) {
    el.classList.add('muncul')
    const opsi = binding.value ?? {}
    if (opsi.arah) el.dataset.arah = opsi.arah
    if (opsi.jeda) el.style.setProperty('--jeda', `${opsi.jeda}ms`)

    const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (kurangiGerak || !('IntersectionObserver' in window)) {
      el.classList.add('tampil')
      return
    }
    ambilPengamat().observe(el)
  },
  unmounted(el) {
    pengamat?.unobserve(el)
  },
}