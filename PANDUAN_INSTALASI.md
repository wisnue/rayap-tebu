# Panduan Instalasi Aplikasi Rayap Tebu

Dokumen ini berisi panduan lengkap dan mudah dipahami untuk menginstal dan menjalankan aplikasi Rayap Tebu, baik di lingkungan lokal maupun di Netlify.

## Daftar Isi
1. [Instalasi Lokal](#instalasi-lokal)
2. [Deployment ke Netlify](#deployment-ke-netlify)
3. [Penggunaan Aplikasi](#penggunaan-aplikasi)
4. [Pemecahan Masalah](#pemecahan-masalah)

## Instalasi Lokal

### Prasyarat
Sebelum memulai, pastikan komputer Anda telah memiliki:
- Node.js (versi 14.0.0 atau lebih baru)
  - [Download Node.js](https://nodejs.org/id/download/)
  - Untuk mengecek apakah Node.js sudah terinstal, buka terminal/command prompt dan ketik: `node -v`

### Langkah-langkah Instalasi (Dengan Gambar)

#### 1. Ekstrak file zip

Klik kanan pada file `rayap-tebu.zip` yang telah Anda download, lalu pilih "Extract All" (Windows) atau "Extract" (Mac/Linux).

![Ekstrak File](https://example.com/extract-file.png)

#### 2. Buka terminal atau command prompt

- **Windows**: Tekan tombol `Win + R`, ketik `cmd`, lalu tekan Enter
- **Mac**: Buka Finder → Applications → Utilities → Terminal
- **Linux**: Tekan `Ctrl + Alt + T`

#### 3. Navigasi ke folder hasil ekstrak

Ketik perintah berikut di terminal/command prompt (ganti `path/to/rayap-tebu` dengan lokasi folder Anda):

```bash
cd path/to/rayap-tebu
```

Contoh:
- Windows: `cd C:\Users\NamaAnda\Downloads\rayap-tebu`
- Mac/Linux: `cd /home/NamaAnda/Downloads/rayap-tebu`

#### 4. Instal dependensi

Ketik perintah berikut dan tekan Enter:

```bash
npm install
```

![Instal Dependensi](https://example.com/install-dependencies.png)

Tunggu hingga proses instalasi selesai. Ini mungkin memerlukan waktu beberapa menit tergantung kecepatan internet Anda.

#### 5. Jalankan aplikasi

Setelah instalasi selesai, ketik perintah berikut untuk menjalankan aplikasi:

```bash
npm run dev
```

![Jalankan Aplikasi](https://example.com/run-app.png)

#### 6. Akses aplikasi

Buka browser web Anda (Chrome, Firefox, Edge, dll) dan kunjungi alamat:

```
http://localhost:5173
```

Aplikasi Rayap Tebu akan terbuka di browser Anda.

![Aplikasi Berjalan](https://example.com/app-running.png)

### Build untuk Produksi (Opsional)

Jika Anda ingin membuat versi produksi dari aplikasi:

1. Ketik perintah berikut di terminal:

```bash
npm run build
```

2. Setelah proses build selesai, folder `dist` akan dibuat yang berisi file-file statis.

3. Untuk menguji versi produksi secara lokal, instal `serve`:

```bash
npm install -g serve
```

4. Jalankan server statis:

```bash
serve -s dist
```

5. Buka browser dan kunjungi alamat yang ditampilkan di terminal (biasanya `http://localhost:5000`).

## Deployment ke Netlify

Netlify adalah platform hosting yang sangat mudah digunakan untuk aplikasi web seperti Rayap Tebu. Berikut adalah langkah-langkah detail untuk men-deploy aplikasi ke Netlify:

### Metode 1: Deployment Langsung dari Folder Dist (Paling Mudah)

#### 1. Build aplikasi

Pertama, build aplikasi dengan perintah:

```bash
npm run build
```

#### 2. Buat akun Netlify

1. Kunjungi [netlify.com](https://www.netlify.com/)
2. Klik tombol "Sign up" dan ikuti petunjuk untuk membuat akun
   - Anda dapat mendaftar menggunakan akun GitHub, GitLab, Bitbucket, atau email

![Buat Akun Netlify](https://example.com/netlify-signup.png)

#### 3. Login ke Netlify

Setelah membuat akun, login ke dashboard Netlify.

#### 4. Upload folder dist

1. Di dashboard Netlify, klik tombol "Sites" di navigasi atas
2. Seret dan lepas folder `dist` dari komputer Anda ke area yang ditandai di halaman Netlify

![Upload ke Netlify](https://example.com/netlify-upload.png)

3. Tunggu beberapa detik hingga proses upload dan deployment selesai

#### 5. Akses situs Anda

1. Setelah deployment selesai, Netlify akan memberikan URL acak untuk situs Anda (misalnya `https://random-name-123456.netlify.app`)
2. Klik URL tersebut untuk mengakses aplikasi Rayap Tebu yang telah di-deploy

![Situs Terdeployed](https://example.com/netlify-deployed.png)

#### 6. Konfigurasi domain kustom (opsional)

1. Di halaman situs Anda di Netlify, klik "Domain settings"
2. Klik "Add custom domain" dan ikuti petunjuk untuk mengonfigurasi domain kustom Anda

### Metode 2: Deployment dari GitHub

#### 1. Buat repositori GitHub

1. Kunjungi [github.com](https://github.com) dan login
2. Klik tombol "+" di pojok kanan atas, lalu pilih "New repository"
3. Beri nama repositori (misalnya "rayap-tebu"), atur visibilitas, lalu klik "Create repository"
4. Ikuti petunjuk untuk mengupload kode aplikasi Anda ke repositori GitHub

#### 2. Hubungkan Netlify dengan GitHub

1. Di dashboard Netlify, klik "New site from Git"
2. Pilih GitHub sebagai penyedia Git
3. Otorisasi Netlify untuk mengakses repositori GitHub Anda
4. Pilih repositori yang berisi kode aplikasi Rayap Tebu

![Hubungkan GitHub](https://example.com/netlify-github.png)

#### 3. Konfigurasi build

Isi formulir dengan informasi berikut:

- Build command: `npm run build`
- Publish directory: `dist`

![Konfigurasi Build](https://example.com/netlify-build-config.png)

#### 4. Deploy situs

Klik "Deploy site" dan tunggu hingga proses deployment selesai.

#### 5. Akses situs Anda

Setelah deployment selesai, klik URL yang diberikan oleh Netlify untuk mengakses aplikasi Rayap Tebu.

### Konfigurasi Tambahan untuk Netlify

Untuk memastikan aplikasi single-page (SPA) berfungsi dengan baik di Netlify, buat file `_redirects` di folder `public` dengan konten berikut:

```
/* /index.html 200
```

Atau, buat file `netlify.toml` di root proyek dengan konten:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Penggunaan Aplikasi

Setelah aplikasi berhasil diinstal dan dijalankan, Anda dapat menggunakan fitur-fitur berikut:

### 1. Dashboard

Halaman utama yang menampilkan ringkasan data pengiriman tebu.

![Dashboard](https://example.com/dashboard.png)

### 2. Input Data

Halaman untuk memasukkan data pengiriman tebu baru.

1. Klik menu "Input Data" di navigasi
2. Isi semua field yang diperlukan:
   - Tanggal pengiriman
   - Lokasi
   - Pabrik Gula
   - Sopir (nomor truk akan otomatis terisi)
   - Berat tebu (kwintal)
3. Klik tombol "Simpan" untuk menyimpan data

![Input Data](https://example.com/input-data.png)

### 3. Tabel Data

Halaman untuk melihat, mencari, dan memfilter data pengiriman tebu.

1. Klik menu "Tabel Data" di navigasi
2. Gunakan fitur pencarian untuk menemukan data tertentu
3. Gunakan filter untuk menyaring data berdasarkan:
   - Lokasi
   - Pabrik Gula
   - Sopir
   - Rentang tanggal
4. Klik tombol "Export ke Excel" untuk mengunduh data dalam format CSV

![Tabel Data](https://example.com/table-data.png)

### 4. Analisis

Halaman yang menampilkan visualisasi data dalam bentuk grafik dan diagram.

1. Klik menu "Analisis" di navigasi
2. Pilih rentang waktu (Hari, Minggu, Bulan, Tahun)
3. Pilih jenis grafik (Bar, Area, Line)
4. Lihat berbagai visualisasi:
   - Pendapatan per Bulan
   - Tren Harian Pengiriman Tebu
   - Distribusi Tebu berdasarkan Lokasi
   - Distribusi Tebu berdasarkan Pabrik

![Analisis](https://example.com/analysis.png)

### 5. Pengaturan

Halaman untuk mengkonfigurasi lokasi, pabrik gula, dan sopir.

1. Klik menu "Pengaturan" di navigasi
2. Pilih tab yang ingin dikonfigurasi:
   - Lokasi: Tambah, edit, atau hapus lokasi pertanian
   - Pabrik Gula: Tambah, edit, atau hapus pabrik gula beserta harga transportasi
   - Sopir: Tambah, edit, atau hapus sopir beserta nomor truk

![Pengaturan](https://example.com/settings.png)

## Pemecahan Masalah

### Aplikasi tidak berjalan setelah instalasi

- **Masalah**: Pesan error saat menjalankan `npm run dev`
- **Solusi**:
  1. Pastikan Node.js terinstal dengan benar (jalankan `node -v`)
  2. Pastikan semua dependensi terinstal (jalankan `npm install` lagi)
  3. Periksa apakah ada error di terminal dan cari solusinya di Google

### Data tidak tersimpan setelah refresh halaman

- **Masalah**: Data yang diinput hilang setelah me-refresh halaman
- **Solusi**:
  1. Pastikan browser Anda mendukung IndexedDB
  2. Pastikan Anda tidak menggunakan mode penyamaran/incognito
  3. Pastikan Anda tidak menghapus data browser secara rutin
  4. Coba gunakan browser lain (Chrome, Firefox, Edge)

### Masalah tampilan di perangkat mobile

- **Masalah**: Tampilan tidak responsif di smartphone atau tablet
- **Solusi**:
  1. Pastikan Anda menggunakan browser terbaru
  2. Coba refresh halaman
  3. Periksa apakah zoom browser diatur ke 100%
  4. Putar perangkat ke mode landscape jika tampilan terlalu sempit

### Bantuan lebih lanjut

Jika Anda mengalami masalah lain, silakan hubungi kami melalui email di sherlyta.sayang@gmail.com.

---

Terima kasih telah menggunakan aplikasi Rayap Tebu! Kami harap aplikasi ini membantu Anda dalam melacak dan menganalisis pengiriman tebu dari lahan pertanian ke pabrik gula.
