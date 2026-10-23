<script setup>
import { ref, computed } from 'vue'
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import PanelFoto from '@/components/admin/PanelFoto.vue'
import PanelKontak from '@/components/admin/PanelKontak.vue'

const auth = useAuthStore()

const TAB = [
  {
    id: 'track',
    label: 'Track Record',
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
    tipe: 'foto',
    judul: 'Pricelist Pembuatan Artikel',
    petunjuk: 'Bingkai persegi (1:1). Jumlah foto bebas.',
    daftarUrl: '/api/admin/pricelist/pembuatan-artikel',
    hapusUrl: '/api/admin/pricelist/item',
    bentuk: 'persegi',
  },
  { id: 'kontak', label: 'Kontak', tipe: 'kontak' },
]

const aktif = ref('track')
const tab = computed(() => TAB.find((t) => t.id === aktif.value))
</script>

<template>
  <div class="halaman">
    <header class="atas">
      <h1>Dashboard GyaJokPub</h1>
      <div class="akun">
        <span>{{ auth.email }}</span>
        <button type="button" class="keluar" @click="auth.keluar()">
          <LogOut :size="16" aria-hidden="true" /> Keluar
        </button>
      </div>
    </header>

    <nav class="tab" role="tablist" aria-label="Section landing page">
      <button
        v-for="t in TAB"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="aktif === t.id"
        :class="{ aktif: aktif === t.id }"
        @click="aktif = t.id"
      >
        {{ t.label }}
      </button>
    </nav>

    <main class="isi">
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
    </main>
  </div>
</template>

<style scoped>
/* Mobile (<641px) = default */
.halaman {
  max-width: 100%;
  margin: 0 auto;
  padding: 0.75rem;
  font-family: sans-serif;
}
.atas {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
}
.atas h1 {
  margin: 0;
  font-size: 1.15rem;
}
.akun {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  font-size: 0.85rem;
  overflow-wrap: anywhere;
}
.keluar {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.tab {
  display: flex;
  gap: 0.4rem;
  margin: 0.75rem 0;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}
.tab button {
  flex: none;
  padding: 0.45rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 999px;
  background: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
}
.tab button.aktif {
  background: #111;
  border-color: #111;
  color: #fff;
}
.isi {
  padding-bottom: 2rem;
}

/* Tablet */
@media (min-width: 641px) {
  .halaman {
    padding: 1rem 1.5rem;
  }
  .atas {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
  .atas h1 {
    font-size: 1.3rem;
  }
  .akun {
    font-size: 0.9rem;
  }
  .tab button {
    padding: 0.5rem 0.9rem;
    font-size: 0.9rem;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .halaman {
    max-width: 900px;
    padding: 1.25rem 2rem;
  }
  .atas h1 {
    font-size: 1.45rem;
  }
  .tab {
    flex-wrap: wrap;
    overflow-x: visible;
    margin: 1.25rem 0;
  }
}

/* Large desktop */
@media (min-width: 1024px) {
  .halaman {
    max-width: 1100px;
    padding: 1.5rem 2.5rem;
  }
  .atas h1 {
    font-size: 1.6rem;
  }
  .isi {
    padding-bottom: 4rem;
  }
}
</style>