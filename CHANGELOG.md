# Changelog GyaJokPub

Seluruh perubahan penting pada GyaJokPub dicatat di sini. Berkas yang sama dipakai di dua repo: `gyajokpub` (frontend) dan `gyajokpub-backend` (backend).

## Aturan versi

Format `MAJOR.MINOR` (contoh: 2.3), berlaku untuk **seluruh produk** (frontend dan backend).

- **MAJOR** (1.0, 2.0, 3.0, ...) naik untuk perubahan **UI/UX besar**. MINOR kembali ke 0.
- **MINOR** (1.1, 1.2, 2.1, ...) naik untuk **keamanan**, perubahan kecil di backend, perbaikan bug, dan penyesuaian kecil lainnya.

Kategori: **Ditambahkan**, **Diubah**, **Diperbaiki**, **Keamanan**.
Penanda cakupan: `[FE]` frontend, `[BE]` backend, `[INFRA]` hosting dan konfigurasi.

Sebelum merilis versi baru: tambahkan entri di paling atas, ubah `version` di `package.json` (misalnya `2.4.0`), lalu beri tag git `vX.Y`.

---

## [3.0] - 2026-10-31

Penambahan besar pada UI/UX landing page: tiga section baru dan sistem animasi saat di-scroll.

### Ditambahkan
- `[FE]` Section **LAYANAN GYAJOKPUB** (setelah Tentang): enam kartu berwarna dengan ikon, memuat Publikasi jurnal Sinta 1 – 6, nasional non-Sinta, internasional non-Sinta, pembuatan artikel dari nol, convert skripsi ke artikel jurnal, dan konsultasi pemilihan jurnal.
- `[FE]` Section **KENAPA MEMILIH GYAJOKPUB** (setelah Pricelist Pembuatan Artikel): sembilan keunggulan dalam kartu berikon, dengan kartu Fasttrack yang disorot.
- `[FE]` Section **ALUR LAYANAN**: linimasa delapan langkah (konsultasi sampai publish selesai). Garis penghubungnya terisi mengikuti posisi scroll, simpul langkah menyala saat terlewati, dan kartu masuk bergantian dari kiri dan kanan di layar lebar.
- `[FE]` Sistem animasi `v-muncul` (`src/utils/muncul.js`): elemen beranimasi masuk saat terlihat dan keluar saat meninggalkan layar. Otomatis nonaktif untuk pengguna yang memilih mengurangi gerakan.
- `[BE]` Asisten AI mengenal daftar layanan, alur layanan (termasuk DP 50%), dan akun OJS untuk memantau proses.

### Diubah
- `[FE]` `LandingPage.vue`: section statis (Layanan, Kenapa Memilih, Alur) tetap tampil walau data dari API gagal dimuat, dan panel mencegah geser horizontal saat animasi.
- `[FE]` Keunggulan Fasttrack ditulis mengikuti banner resmi: tersedia untuk Sinta 3 s/d 6 dan non Sinta.

## [2.5] - 2026-10-24

### Diubah
- `[FE]` Judul tab browser kini berbeda per halaman: `GyaJokPub - Login Admin` dan `GyaJokPub - Dashboard Admin` (halaman publik tetap `GyaJokPub`).
- `[BE]` Asisten AI dilatih ulang dengan data banner resmi: kisaran harga tiap jenis jurnal, estimasi waktu, ketersediaan Fasttrack dan Reguler, penulisan artikel, dan keunggulan layanan. AI kini menyebut harga hanya sebagai **kisaran**, dan harga pasti diarahkan ke admin.

### Diperbaiki
- `[BE]` Data layanan AI: Non Sinta Internasional tersedia Fasttrack dan Reguler (sebelumnya tertulis hanya Reguler), dan Sinta 6 masuk daftar layanan (sebelumnya hanya Sinta 1 sampai 5).

## [2.4] - 2026-10-24

### Diperbaiki
- `[FE]` Galeri foto di landing page (Track Record dan ketiga Pricelist) memakai grid yang terisi **per baris**. Sebelumnya memakai kolom CSS yang terisi dari atas ke bawah, sehingga urutan foto berbeda dari dashboard dan baris pertama tidak penuh.
- `[FE]` Jumlah kolom galeri: 2 di mobile, 4 di tablet, desktop, dan large desktop.

### Diubah
- `[FE]` `vite.config.js`: proxy `/foto` ke `https://gyajokpub.com` untuk pengembangan lokal, supaya foto tetap tampil walau `r2.dev` diblokir ISP.
- Pengembangan lokal: `R2_PUBLIC_URL` (backend) dan Turnstile (kedua sisi) dikosongkan.

### Ditambahkan
- `README.md` untuk kedua repo dan `CHANGELOG.md` ini.

## [2.3] - 2026-10-24

### Keamanan
- `[BE]` `FRONTEND_ORIGINS`: seluruh spasi dan baris baru dibuang, termasuk yang terselip di tengah alamat (penyebab alamat CORS tidak cocok pada insiden sebelumnya).
- `[INFRA]` CSP: `https://*.r2.dev` dihapus dari `img-src` karena foto kini dilayani dari domain sendiri.

### Ditambahkan
- `[BE]` Log saat server menyala: jumlah alamat CORS yang diizinkan dan status Turnstile.
- `[INFRA]` Pemantau gratis **StatusCake** memanggil `/api/ping` tiap 5 menit, supaya layanan Render tidak tidur dan pengunjung tidak menunggu 30-60 detik.

## [2.2] - 2026-10-24

### Ditambahkan
- `[INFRA]` Domain resmi `gyajokpub.com` dan `www.gyajokpub.com` sebagai Custom Domain Worker.
- `[INFRA]` `FRONTEND_ORIGINS` di Render memuat tiga alamat (domain, `www`, dan `workers.dev`), dan hostname Turnstile ditambahkan.

### Diperbaiki
- `[FE]` Logo dimuat lewat `import` sehingga ikut ke build produksi (sebelumnya alamat `/assets/...` tidak ada di produksi dan yang tampil hanya teks).

## [2.1] - 2026-10-24

### Ditambahkan
- `[INFRA]` Worker `worker/index.js` melayani foto di `/foto/*` langsung dari bucket R2 lewat binding `FOTO`. `wrangler.jsonc` memakai `run_worker_first: ["/foto/*"]`, jadi hanya alamat itu yang melewati Worker.

### Diubah
- `[BE]` `R2_PUBLIC_URL` kini opsional. Bila kosong, alamat foto berbentuk `/foto/<key>`.

### Diperbaiki
- Foto rusak di jaringan yang memblokir `r2.dev` (Internet Positif). Foto kini dilayani dari domain situs sendiri.

## [2.0] - 2026-10-24

Redesain UI/UX besar.

### Ditambahkan
- `[FE]` Tema baru (`src/styles/tema.css`): gradien biru navy ke teal, aksen emas, dan font Source Serif 4 serta Instrument Sans.
- `[FE]` Halaman login admin baru: panel merek, ikon pada kolom, **tombol tampilkan/sembunyikan** pada password dan kode akses, kode akses hanya menerima angka, pesan galat dengan ikon.
- `[FE]` Dashboard admin baru: header gradien dengan logo, tautan "Lihat situs", sidebar di desktop dan chip menu di mobile, penghitung foto, tampilan unggah dan kartu foto baru.
- `[FE]` Landing page baru: hero dengan logo besar dan tombol "Hubungi Kami", panel bertumpuk, garis emas di bawah judul, panel kontak bergradien, footer.
- `[FE][BE]` **Keterangan per foto** (maks 200 karakter): kolom `keterangan` (migrasi `keterangan_foto`), endpoint `PATCH`, tampil di bawah foto dan di lightbox, diubah lewat ikon pensil di dashboard.

### Diubah
- `[FE]` `GaleriFoto`, `LightboxFoto`, `KontakKami`, `PanelFoto`, `PanelKontak`, dan `UploadGambar` disesuaikan dengan tema baru, semuanya dengan empat breakpoint (mobile, 641px, 768px, 1024px).

## [1.2] - 2026-10-23

### Keamanan
- `[FE][BE]` **Cloudflare Turnstile** pada login admin dan chat AI. Widget bermode `interaction-only`, server memverifikasi lewat `siteverify`, dan nonaktif bila `TURNSTILE_SECRET` kosong.
- `[INFRA]` CSP diubah dari Report-Only menjadi **enforced**.

### Diperbaiki
- `[FE]` Garis miring berlebih di akhir `VITE_API_URL` dibuang otomatis (sebelumnya menghasilkan alamat `//api/...` dan 404).

## [1.1] - 2026-10-23

### Diperbaiki
- `[FE]` `http.js`: respons yang bukan JSON dianggap galat. Mencegah halaman putih saat alamat API salah, dan kini muncul pesan galat dengan tombol "Coba lagi".

## [1.0] - 2026-10-23

Rilis perdana ke produksi.

### Ditambahkan
- `[FE]` Landing page publik: logo, tagline "Publication Made Simpler", Tentang, Track Record (frame mengikuti bentuk foto), tiga Pricelist (frame 1:1), Kontak Kami (WhatsApp, Email, Threads, X, Instagram), tampilan foto besar (lightbox), responsif dengan empat breakpoint.
- `[FE]` Asisten AI di landing page: tombol pil yang mengecil menjadi ikon, sapaan tertunda satu detik, gelembung pesan beranimasi.
- `[FE]` Halaman admin tersembunyi (`/loginadmin`) dan dashboard dengan satu tab per section.
- `[BE]` API Express 5 dan TypeScript dengan Prisma 7 dan database Neon (PostgreSQL).
- `[BE]` Login admin tiga faktor (email, password, kode akses 6 digit), token JWT 1 jam, perpanjangan sesi dengan batas mutlak 8 jam.
- `[BE]` Unggah foto ke Cloudflare R2 dengan pemrosesan `sharp` (WebP, orientasi EXIF dibenahi, metadata dibuang, sisi terpanjang maksimal 2000 px). Urutan dan hapus foto. Kontak divalidasi per domain resmi.
- `[BE]` Endpoint publik `GET /api/public/konten` (cache 30 detik).
- `[BE]` Chat AI lewat Cloudflare Workers AI: kontak diambil dari database, pembatas 6 per menit dan 40 per hari per IP, plus jatah harian total.
- `[BE]` Pembatas laju, `helmet`, daftar izin CORS, validasi `zod`.
- `[INFRA]` Neon (Singapura), bucket R2 terpisah, Render (Docker, health check `/api/ping`), Cloudflare Workers static assets (`wrangler.jsonc`), header keamanan dengan CSP Report-Only.

---

## Rencana (belum dikerjakan)
- `npm audit` berkala di kedua repo.
- Catatan serah-terima lengkap (`HANDOFF_GYAJOKPUB.md`).