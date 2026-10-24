<script setup>
import { ref, computed } from 'vue'
import { LogOut, Award, Tag, FileText, Contact, ExternalLink } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import PanelFoto from '@/components/admin/PanelFoto.vue'
import PanelKontak from '@/components/admin/PanelKontak.vue'

const auth = useAuthStore()

const LOGO = '/logo.png'
const logoGagal = ref(false)

const TAB = [
  {
    id: 'track',
    label: 'Track Record',
    ikon: Award,
    tipe: 'foto',
    judul: 'Track Record Publikasi',
    petunjuk: 'Bingkai di landing page mengikuti bentuk asli tiap foto.',
    daftarUrl: '/api/admin/track-record',
    hapusUrl: '/api/admin/track-record',
    bentuk: 'bebas',
  },
  {
    id: 'jurnal',
    label: 'Pricelist Jurnal',
    ikon: Tag,
    tipe: 'foto',
    judul: 'Pricelist Publikasi Jurnal',
    petunjuk: 'Bingkai persegi (1:1). Jumlah foto bebas.',
    daftarUrl: '/api/admin/pricelist/publikasi-jurnal',
    hapusUrl: '/api/admin/pricelist/item',
    bentuk: 'persegi',
  },
  {
    id: 'nonsinta',
    label: 'Pricelist Non Sinta',
    ikon: Tag,
    tipe: 'foto',
    judul: 'Pricelist Non Sinta',
    petunjuk: 'Bingkai persegi (1:1). Jumlah foto bebas.',
    daftarUrl: '/api/admin/pricelist/non-sinta',
    hapusUrl: '/api/admin/pricelist/item',
    bentuk: 'persegi',
  },
  {
    id: 'artikel',
    label: 'Pricelist Artikel',
    ikon: FileText,
    tipe: 'foto',
    judul: 'Pricelist Pembuatan Artikel',
    petunjuk: 'Bingkai persegi (1:1). Jumlah foto bebas.',
    daftarUrl: '/api/admin/pricelist/pembuatan-artikel',
    hapusUrl: '/api/admin/pricelist/item',
    bentuk: 'persegi',
  },
  { id: 'kontak', label: 'Kontak', ikon: Contact, tipe: 'kontak' },
]

const aktif = ref('track')
const tab = computed(() => TAB.find((t) => t.id === aktif.value))
</script>

<template>
  <div class="halaman">
    <header class="atas">
      <div class="merek">
        <span class="chip">
          <img v-if="!logoGagal" :src="LOGO" alt="GyaJokPub" @error="logoGagal = true" />
          <strong v-else>GyaJokPub</strong>
        </span>
        <span class="judul-admin">Dashboard</span>
      </div>
      <div class="akun">
        <a class="pil" href="/" target="_blank" rel="noopener">
          <ExternalLink :size="16" aria-hidden="true" /> <span>Lihat situs</span>
        </a>
        <span class="email">{{ auth.email }}</span>
        <button type="button" class="pil" @click="auth.keluar()">
          <LogOut :size="16" aria-hidden="true" /> <span>Keluar</span>
        </button>
      </div>
    </header>

    <div class="badan">
      <nav class="menu" role="tablist" aria-label="Section landing page">
        <button
          v-for="t in TAB"
          :key="t.id"
          type="button"
          role="tab"
          :aria-selected="aktif === t.id"
          :class="{ aktif: aktif === t.id }"
          @click="aktif = t.id"
        >
          <component :is="t.ikon" :size="18" aria-hidden="true" />
          <span>{{ t.label }}</span>
        </button>
      </nav>

      <main class="isi">
        <div class="kartu-isi">
          <PanelKontak v-if="tab.tipe === 'kontak'" key="kontak" />
          <PanelFoto
            v-else
            :key="'foto-' + tab.id"
            :judul="tab.judul"
            :petunjuk="tab.petunjuk"
            :daftar-url="tab.daftarUrl"
            :hapus-url="tab.hapusUrl"
            :bentuk="tab.bentuk"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Mobile (<641px) = default */
.halaman {
  min-height: 100dvh;
}
.atas {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.9rem 1rem 1.1rem;
  background:
    radial-gradient(circle at 90% 0%, rgba(255, 255, 255, 0.14), transparent 45%),
    var(--gradien);
  color: #fff;
}
.merek {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.chip {
  display: grid;
  place-items: center;
  padding: 0.3rem 0.6rem;
  border-radius: 10px;
  background: #fff;
}
.chip img {
  display: block;
  height: 34px;
}
.chip strong {
  color: var(--navy-900);
  font-family: var(--font-judul);
}
.judul-admin {
  font-family: var(--font-judul);
  font-size: 1.15rem;
  font-weight: 700;
}
.akun {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.email {
  display: none;
  overflow: hidden;
  font-size: 0.85rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.9;
}
.pil {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease;
}
.pil:hover {
  background: rgba(255, 255, 255, 0.26);
}
.pil:focus-visible {
  outline-color: #fff;
}

.badan {
  padding: 0.75rem;
}
.menu {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  overflow-x: auto;
}
.menu button {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--garis);
  border-radius: 999px;
  background: #fff;
  color: var(--tinta);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}
.menu button.aktif {
  border-color: transparent;
  background: linear-gradient(135deg, var(--navy-700), var(--teal-600));
  color: #fff;
}
.kartu-isi {
  padding: 1rem;
  border: 1px solid var(--garis);
  border-radius: var(--radius);
  background: var(--permukaan);
  box-shadow: var(--bayangan);
}

/* Tablet */
@media (min-width: 641px) {
  .atas {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
  }
  .email {
    display: block;
    max-width: 220px;
  }
  .badan {
    padding: 1rem 1.5rem 2rem;
  }
  .kartu-isi {
    padding: 1.5rem;
  }
}

/* Desktop: menu menjadi sidebar di kiri */
@media (min-width: 768px) {
  .badan {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 1.25rem;
    max-width: 1000px;
    margin: 0 auto;
    padding: 1.5rem 2rem 3rem;
  }
  .menu {
    position: sticky;
    top: 1rem;
    flex-direction: column;
    align-self: start;
    gap: 0.25rem;
    margin: 0;
    padding: 0.5rem;
    overflow: visible;
    border: 1px solid var(--garis);
    border-radius: var(--radius);
    background: var(--permukaan);
  }
  .menu button {
    width: 100%;
    padding: 0.65rem 0.8rem;
    border: 0;
    border-radius: 10px;
    font-size: 0.9rem;
    text-align: left;
  }
  .menu button:hover:not(.aktif) {
    background: var(--kertas);
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .atas {
    padding: 1.1rem 2.5rem;
  }
  .badan {
    grid-template-columns: 250px minmax(0, 1fr);
    gap: 1.5rem;
    max-width: 1180px;
    padding: 2rem 2.5rem 4rem;
  }
  .kartu-isi {
    padding: 2rem;
  }
}
</style>