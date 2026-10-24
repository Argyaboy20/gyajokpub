# GyaJokPub (frontend)

Website jasa pendampingan publikasi jurnal **GyaJokPub** ("Publication Made Simpler"): landing page publik untuk calon klien, dashboard admin untuk mengelola kontennya, dan asisten AI yang menjawab pertanyaan seputar layanan.

- Situs: https://gyajokpub.com
- API: https://gyajokpub-api.onrender.com
- Versi saat ini: **2.4** (lihat [CHANGELOG.md](CHANGELOG.md))

Repo ini adalah **frontend**. Backend ada di repo terpisah: `gyajokpub-backend`.

## Fitur

**Halaman publik** (`/`)
- Logo, tagline, dan bagian Tentang
- Track Record Publikasi (frame mengikuti bentuk asli tiap foto)
- Pricelist Publikasi Jurnal, Pricelist Non Sinta, dan Pricelist Pembuatan Artikel (frame 1:1)
- Keterangan di bawah tiap foto, dan tampilan foto besar (lightbox)
- Kontak Kami: WhatsApp, Email, Threads, X, Instagram
- Asisten AI untuk pertanyaan seputar Sinta, non Sinta, Scopus Q3 dan Q4, serta jalur Fasttrack dan Reguler
- Responsif dengan empat breakpoint: mobile (default, di bawah 641px), tablet (641px), desktop (768px), large desktop (1024px)

**Dashboard admin** (`/loginadmin` lalu `/admin/dashboard`)
- Satu tab per section: Track Record, tiga Pricelist, dan Kontak
- Unggah beberapa foto sekaligus, ubah urutan, ubah keterangan, hapus
- Alamat login tidak ditautkan dari halaman publik

## Teknologi

Vue 3, Vite, Vue Router, Pinia, `lucide-vue-next` (ikon antarmuka), `simple-icons` (logo merek), `@fontsource-variable` (Source Serif 4 dan Instrument Sans), Cloudflare Workers (static assets dan R2 binding).

## Arsitektur

```
Pengunjung / Admin
      |
      v
Cloudflare Workers  (repo ini)
  - aset statis (dist) dan fallback SPA
  - /foto/*  ->  Worker membaca bucket R2 (binding FOTO)
      |
      | fetch ke VITE_API_URL
      v
Render (backend, Docker)  ->  Neon (PostgreSQL), R2 (unggah foto), Workers AI (chat)
```

## Struktur proyek

```
gyajokpub/
  assets/logogyajokpub.png      logo (di-import oleh komponen)
  public/_headers               header keamanan dan CSP
  worker/index.js               Worker untuk /foto/*
  wrangler.jsonc                konfigurasi deploy Cloudflare
  vite.config.js                termasuk proxy /foto untuk lokal
  src/
    main.js  App.vue
    api/http.js                 pembungkus fetch dan penanganan galat
    router/index.js             /  /loginadmin  /admin/dashboard
    stores/                     auth.js (sesi admin), konten.js (data publik)
    styles/tema.css             warna, font, dan reset global
    utils/                      sesi.js, turnstile.js
    components/                 ChatWidget, GaleriFoto, LightboxFoto, KontakKami, BrandIcon
    components/admin/           UploadGambar, PanelFoto, PanelKontak
    views/                      LandingPage.vue
    views/admin/                LoginAdmin.vue, Dashboard.vue
```

## Menjalankan di lokal

Prasyarat: Node.js 22.12 atau lebih baru, dan backend sudah berjalan di `http://localhost:3000` (lihat README backend).

```
npm install
npm run dev
```

Buka `http://localhost:5173`. Berkas `.env.development` (tanpa rahasia):

```
VITE_API_URL=http://localhost:3000
```

Catatan untuk pengembangan lokal:
- Jangan isi `VITE_TURNSTILE_SITE_KEY` (anti-bot tidak diperlukan di lokal).
- Foto diminta lewat `/foto/...` dan diteruskan oleh proxy di `vite.config.js` ke `https://gyajokpub.com`. Karena itu `R2_PUBLIC_URL` di `.env` backend lokal harus dikosongkan.
- Berkas `.env*` hanya dibaca saat `npm run dev` dimulai. Setelah mengubahnya, jalankan ulang.

Perintah lain: `npm run build` (hasil di `dist`), `npm run preview`, `npm run lint`.

## Variabel lingkungan

| Nama | Dipakai di | Keterangan |
|---|---|---|
| `VITE_API_URL` | lokal dan Build variable Cloudflare | Alamat backend, tanpa garis miring di akhir |
| `VITE_TURNSTILE_SITE_KEY` | Build variable Cloudflare | Site Key publik Turnstile. Kosongkan di lokal |

Variabel `VITE_*` ditanam saat build. Bila nilainya diubah di Cloudflare, build harus diulang.

## Deploy (Cloudflare Workers)

- Dihubungkan ke repo GitHub lewat Workers Builds. Build command `npm run build`, deploy command bawaan `npx wrangler deploy`.
- Nama proyek di Cloudflare harus sama dengan `name` di `wrangler.jsonc` (`gyajokpub`).
- `wrangler.jsonc` mengatur: direktori aset `./dist`, `single-page-application` (agar `/loginadmin` tetap terbuka saat di-refresh), `run_worker_first: ["/foto/*"]`, dan binding R2 `FOTO` ke bucket `gyajokpub-foto`.
- `public/_headers` memuat header keamanan dan Content-Security-Policy.
- Domain: `gyajokpub.com` dan `www.gyajokpub.com` sebagai Custom Domain Worker.

## Keamanan

- Login admin memakai email, password, dan kode akses 6 digit, ditambah Cloudflare Turnstile.
- Token sesi disimpan di `sessionStorage` (hilang saat tab ditutup) dan diperpanjang otomatis hingga batas 8 jam.
- CSP aktif (hanya sumber dari domain sendiri dan Cloudflare Turnstile), disertai `X-Frame-Options`, `X-Content-Type-Options`, dan `Permissions-Policy`.
- Teks dari AI dan pengunjung ditampilkan sebagai teks biasa, tidak pernah sebagai HTML.

## Versi

Format `MAJOR.MINOR`: MAJOR naik untuk perubahan UI/UX besar, MINOR untuk keamanan dan perubahan kecil. Rincian ada di [CHANGELOG.md](CHANGELOG.md).