# Panduan Instalasi Aplikasi Pelacakan Tebu

Panduan ini akan membantu Anda menginstal dan menjalankan Aplikasi Pelacakan Tebu baik di komputer lokal maupun di internet menggunakan Netlify.

## Daftar Isi
1. [Instalasi Lokal](#instalasi-lokal)
   - [Prasyarat](#prasyarat)
   - [Langkah-langkah Instalasi](#langkah-langkah-instalasi)
   - [Menjalankan Aplikasi](#menjalankan-aplikasi)
2. [Deployment ke Netlify](#deployment-ke-netlify)
   - [Prasyarat](#prasyarat-netlify)
   - [Langkah-langkah Deployment](#langkah-langkah-deployment)
   - [Konfigurasi Domain](#konfigurasi-domain)

## Instalasi Lokal

### Prasyarat

Sebelum memulai, pastikan komputer Anda telah memiliki:

1. **Node.js** (versi 16 atau lebih baru)
   - Unduh dan instal dari [nodejs.org](https://nodejs.org/)
   - Untuk memastikan Node.js terinstal, buka Command Prompt (Windows) atau Terminal (Mac/Linux) dan ketik:
     ```
     node --version
     ```

2. **npm** (alternatif: npm atau yarn)
   - Setelah Node.js terinstal, buka Command Prompt atau Terminal dan ketik:
     ```
     npm install -g npm
     ```
   - Untuk memastikan npm terinstal, ketik:
     ```
     npm --version
     ```

3. **Git** (opsional, jika Anda ingin mengkloning repositori)
   - Unduh dan instal dari [git-scm.com](https://git-scm.com/)

### Langkah-langkah Instalasi

1. **Unduh Aplikasi**
   
   **Cara 1: Menggunakan Git**
   - Buka Command Prompt atau Terminal
   - Pindah ke direktori tempat Anda ingin menyimpan aplikasi
   - Ketik perintah berikut:
     ```
     git clone https://github.com/sherlyta369/petani-app.git
     cd petani-app
     ```

   **Cara 2: Mengunduh ZIP**
   - Unduh file ZIP dari [GitHub](https://github.com/sherlyta369/petani-app)
   - Ekstrak file ZIP ke folder pilihan Anda
   - Buka Command Prompt atau Terminal
   - Pindah ke direktori tempat Anda mengekstrak file:
     ```
     cd jalur/ke/folder/petani-app
     ```

2. **Instal Dependensi**
   - Di dalam direktori aplikasi, jalankan:
     ```
     npm install
     ```
   - Tunggu hingga semua dependensi terinstal (ini mungkin memerlukan waktu beberapa menit)
   - jika terjadi error karena date-fns gunakan perintah berikut ini 
     ```
     npm install date-fns@^3.0.0
     ```

### Menjalankan Aplikasi

1. **Mode Pengembangan**
   - Untuk menjalankan aplikasi dalam mode pengembangan:
     ```
     npm run dev
     ```
   - Buka browser dan akses `http://localhost:5173`
   - Aplikasi akan otomatis dimuat ulang jika Anda mengubah kode sumber

2. **Build untuk Produksi**
   - Untuk membuat versi produksi:
     ```
     npm run build
     ```
   - Hasil build akan tersedia di folder `dist`

3. **Menjalankan Versi Produksi Secara Lokal**
   - Setelah build, Anda dapat menjalankan versi produksi dengan:
     ```
     npm run preview
     ```
   - Buka browser dan akses `http://localhost:4173`

## Deployment ke Netlify

### Prasyarat Netlify

1. **Akun Netlify**
   - Daftar akun gratis di [netlify.com](https://www.netlify.com/)

2. **Repositori Git** (opsional, tetapi direkomendasikan)
   - Akun GitHub, GitLab, atau Bitbucket
   - Aplikasi yang sudah di-push ke repositori

### Langkah-langkah Deployment

#### Cara 1: Deployment Otomatis dari GitHub

1. **Login ke Netlify**
   - Buka [app.netlify.com](https://app.netlify.com/) dan login

2. **Tambahkan Situs Baru**
   - Klik tombol "Add new site" dan pilih "Import an existing project"
   - Pilih penyedia Git Anda (GitHub, GitLab, atau Bitbucket)
   - Berikan akses ke Netlify jika diminta
   - Pilih repositori aplikasi Anda

3. **Konfigurasi Build**
   - Netlify akan otomatis mendeteksi bahwa ini adalah proyek React/Vite
   - Pastikan pengaturan build berikut:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Klik "Deploy site"

4. **Tunggu Proses Deployment**
   - Netlify akan membangun dan men-deploy aplikasi Anda
   - Setelah selesai, Anda akan mendapatkan URL untuk mengakses aplikasi

#### Cara 2: Deployment Manual (Drag & Drop)

1. **Build Aplikasi Lokal**
   - Di komputer Anda, jalankan:
     ```
     npm run build
     ```
   - Ini akan membuat folder `dist` dengan file-file yang siap di-deploy

2. **Upload ke Netlify**
   - Login ke [app.netlify.com](https://app.netlify.com/)
   - Pada dashboard, cari area "Drag and drop your site folder here"
   - Buka folder `dist` di komputer Anda
   - Seret seluruh isi folder `dist` ke area drop di Netlify
   - Tunggu hingga upload selesai

3. **Situs Anda Siap**
   - Netlify akan memberikan URL untuk mengakses aplikasi Anda

### Konfigurasi Domain

1. **Menggunakan Domain Kustom**
   - Di dashboard Netlify, pilih situs Anda
   - Klik tab "Domain settings"
   - Klik "Add custom domain"
   - Ikuti petunjuk untuk menambahkan dan memverifikasi domain Anda

2. **Mengubah Subdomain Netlify**
   - Di dashboard Netlify, pilih situs Anda
   - Klik tab "Domain settings"
   - Di bawah "Custom domains", temukan domain Netlify default Anda
   - Klik tombol "Options" dan pilih "Edit site name"
   - Masukkan nama yang diinginkan dan simpan

## Pemecahan Masalah

### Masalah Umum Instalasi Lokal

1. **Node.js atau npm tidak ditemukan**
   - Pastikan Anda telah menginstal Node.js dan npm
   - Restart Command Prompt atau Terminal setelah instalasi
   - Periksa apakah path instalasi telah ditambahkan ke variabel PATH sistem

2. **Kesalahan saat instalasi dependensi**
   - Coba hapus folder `node_modules` dan file `npm-lock.yaml`
   - Jalankan `npm install` lagi

3. **Aplikasi tidak berjalan di localhost**
   - Periksa apakah port 5173 sudah digunakan oleh aplikasi lain
   - Coba jalankan dengan port berbeda: `npm run dev -- --port 3000`

### Masalah Umum Deployment Netlify

1. **Build gagal di Netlify**
   - Periksa log build di dashboard Netlify
   - Pastikan versi Node.js yang digunakan Netlify kompatibel (tambahkan file `.nvmrc` jika perlu)
   - Tambahkan file `netlify.toml` dengan konfigurasi build yang tepat

2. **Halaman tidak ditemukan setelah navigasi**
   - Tambahkan file `_redirects` di folder `public` dengan konten:
     ```
     /* /index.html 200
     ```
   - Ini akan mengarahkan semua rute ke `index.html` untuk aplikasi single-page

## Dukungan

Jika Anda mengalami masalah yang tidak tercantum di sini, silakan hubungi dukungan kami di:
- Email: sherlyta.sayang@gmail.com
- GitHub: [https://github.com/sherlyta369/petani-app/issues](https://github.com/sherlyta369/petani-app/issues)
