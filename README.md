# StatPeluang (versi statis, tanpa database dan tanpa login)

Website belajar Probabilitas dan Statistika: 23 materi, 45 soal latihan, 4 simulasi/kalkulator.
Teknologi: HTML, CSS, JavaScript murni + KaTeX (rumus) + Chart.js (grafik).

## Cara menjalankan di laptop

1. Ekstrak file `statpeluang-statis.zip` ke folder bebas, misalnya `D:\statpeluang-statis`.
2. Pastikan laptop TERHUBUNG INTERNET (KaTeX dan Chart.js dimuat dari CDN).
3. Pilih salah satu cara:
   - Cara 1 (paling mudah): klik dua kali `index.html`, website terbuka di browser.
   - Cara 2 (VS Code): buka folder di VS Code, pasang ekstensi "Live Server", klik kanan `index.html`, pilih "Open with Live Server".
   - Cara 3 (terminal): buka terminal di folder ini, lalu jalankan `python -m http.server 8000` dan buka http://localhost:8000
     (atau `npx serve` jika memakai Node.js).

Tidak perlu install apa pun, tidak perlu npm, tidak perlu database.

## Struktur file
- index.html        : kerangka halaman
- style.css         : tampilan
- js/materi.js      : data kategori dan SEMUA materi (edit/tambah materi di sini)
- js/soal.js        : bank soal (tambah soal dengan menambah satu baris)
- js/simulasi.js    : simulasi koin/dadu, binomial, kalkulator distribusi, kurva normal
- js/app.js         : navigasi, halaman materi, dan kuis

## Cara menambah materi atau soal
- Materi: salin satu blok `{ id: ..., kat: ..., judul: ... }` di `js/materi.js`, lalu ubah isinya. Rumus ditulis LaTeX.
- Soal: tambahkan satu baris di `js/soal.js` dengan format
  `['idKategori', 'pertanyaan', ['A','B','C','D'], indeksBenar(0-3), 'pembahasan']`
