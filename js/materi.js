// js/materi.js
// Data kategori dan materi pembelajaran.
// - Rumus ditulis dalam LaTeX (dirender KaTeX). r`...` = String.raw agar tanda "\" tidak hilang.
// - Di dalam teks, rumus inline ditulis di antara tanda $ ... $.
// - Untuk menambah materi baru: salin satu blok { ... } di MATERI, lalu ubah isinya.

const r = String.raw;

const KATEGORI = [
  { id: 'dasar',     nama: 'Konsep Dasar Peluang',     ikon: '<svg class="px-bounce" viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges"><rect x="1" y="1" width="14" height="14" fill="#231924"/><rect x="2" y="2" width="12" height="12" fill="#ff595e"/><rect x="3" y="3" width="10" height="10" fill="#ffffff"/><rect x="4" y="4" width="2" height="2" fill="#ff595e"/><rect x="10" y="4" width="2" height="2" fill="#1982c4"/><rect x="7" y="7" width="2" height="2" fill="#ffca3a"/><rect x="4" y="10" width="2" height="2" fill="#8ac926"/><rect x="10" y="10" width="2" height="2" fill="#b5179e"/></svg>', desk: 'Ruang sampel, titik sampel, dan peluang satu kejadian.' },
  { id: 'komplemen', nama: 'Komplemen Kejadian',       ikon: '<svg class="px-wiggle" viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges"><rect x="4" y="1" width="8" height="14" fill="#231924"/><rect x="1" y="4" width="14" height="8" fill="#231924"/><rect x="2" y="2" width="12" height="12" fill="#231924"/><rect x="3" y="3" width="5" height="10" fill="#ffca3a"/><rect x="8" y="3" width="5" height="10" fill="#8338ec"/><rect x="5" y="5" width="2" height="6" fill="#fff3b0"/><rect x="9" y="5" width="2" height="6" fill="#ff85c0"/></svg>', desk: 'Peluang kejadian lawan ("bukan A") untuk menyederhanakan hitungan.' },
  { id: 'fh',        nama: 'Frekuensi Harapan',        ikon: '<svg class="px-bounce" viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges"><rect x="1" y="1" width="14" height="14" fill="#231924"/><rect x="2" y="2" width="12" height="12" fill="#fffef9"/><rect x="9" y="3" width="4" height="4" fill="#ff595e"/><rect x="7" y="5" width="3" height="2" fill="#ffca3a"/><rect x="5" y="7" width="3" height="2" fill="#8ac926"/><rect x="3" y="9" width="3" height="3" fill="#1982c4"/><rect x="3" y="12" width="10" height="1" fill="#231924"/></svg>', desk: 'Taksiran banyak kemunculan kejadian dalam n kali percobaan.' },
  { id: 'majemuk',   nama: 'Peluang Kejadian Majemuk', ikon: '<svg class="px-wiggle" viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges"><rect x="1" y="3" width="9" height="9" fill="#231924"/><rect x="6" y="4" width="9" height="9" fill="#231924"/><rect x="2" y="4" width="7" height="7" fill="#ff70a6"/><rect x="7" y="5" width="7" height="7" fill="#5ce1e6"/><rect x="6" y="5" width="3" height="6" fill="#ffea00"/></svg>', desk: 'Saling lepas, saling bebas, dan peluang bersyarat.' },
  { id: 'pk',        nama: 'Permutasi dan Kombinasi',  ikon: '<svg class="px-bounce" viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges"><rect x="1" y="2" width="7" height="10" fill="#231924"/><rect x="2" y="3" width="5" height="8" fill="#ffca3a"/><rect x="7" y="4" width="8" height="10" fill="#231924"/><rect x="8" y="5" width="6" height="8" fill="#72efdd"/><rect x="4" y="6" width="1" height="2" fill="#ff595e"/><rect x="10" y="8" width="2" height="2" fill="#b5179e"/></svg>', desk: 'Kaidah pencacahan dengan urutan (permutasi) dan tanpa urutan (kombinasi).' },
  { id: 'diskrit',   nama: 'Distribusi Diskrit',       ikon: '<svg class="px-bounce" viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges"><rect x="1" y="1" width="14" height="14" fill="#231924"/><rect x="2" y="2" width="12" height="12" fill="#fffef9"/><rect x="3" y="8" width="3" height="5" fill="#ff595e"/><rect x="6" y="4" width="4" height="9" fill="#ffca3a"/><rect x="10" y="6" width="3" height="7" fill="#00bbf9"/><rect x="2" y="13" width="12" height="1" fill="#231924"/></svg>', desk: 'Seragam, Bernoulli, Binomial, Geometrik, Binomial Negatif, Hipergeometrik, Poisson.' },
  { id: 'kontinu',   nama: 'Distribusi Kontinu',       ikon: '<svg class="px-wiggle" viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges"><rect x="1" y="1" width="14" height="14" fill="#231924"/><rect x="2" y="2" width="12" height="12" fill="#3b2854"/><rect x="6" y="4" width="4" height="8" fill="#ff70a6"/><rect x="4" y="7" width="8" height="5" fill="#ffea00"/><rect x="3" y="10" width="10" height="2" fill="#5ce1e6"/><rect x="7" y="3" width="2" height="2" fill="#ffffff"/></svg>', desk: 'Seragam, Eksponensial, Normal, Gamma, Chi-Kuadrat, t-Student, F.' },
];

const MATERI = [
  // ===================== KONSEP DASAR =====================
  { id: 'konsep-dasar', kat: 'dasar', judul: 'Konsep Dasar Peluang',
    isi: r`Peluang mengukur seberapa mungkin suatu kejadian terjadi, dengan nilai dari $0$ (mustahil) sampai $1$ (pasti).

- Ruang sampel ($S$): himpunan seluruh hasil percobaan yang mungkin.
- Titik sampel: satu anggota tunggal di dalam $S$.
- Kejadian ($A$): himpunan bagian dari $S$ yang diamati.

Rumus ini berlaku bila tiap titik sampel berkesempatan muncul sama besar, dengan $n(A)$ banyak anggota $A$ dan $n(S)$ banyak anggota $S$.`,
    rumus: [r`P(A) = \frac{n(A)}{n(S)}`],
    contoh: r`Sebuah dadu dilempar sekali. Tentukan peluang muncul mata dadu lebih dari 4, lalu hitung peluang muncul gambar pada lemparan satu koin.`,
    bahas: r`Dadu: $S=\{1,2,3,4,5,6\}$, $n(S)=6$. Kejadian $A=\{5,6\}$, $n(A)=2$, sehingga $P(A)=\frac{2}{6}=\frac{1}{3}$.

Koin: $S=\{A,G\}$, $n(S)=2$. Kejadian $G=\{G\}$, $n(G)=1$, sehingga $P=\frac{1}{2}$.` },

  // ===================== KOMPLEMEN =====================
  { id: 'komplemen', kat: 'komplemen', judul: 'Komplemen Kejadian',
    isi: r`Komplemen $A^c$ ("bukan $A$") berisi semua titik sampel di $S$ yang tidak termasuk $A$. Karena $A$ dan $A^c$ mencakup seluruh $S$ tanpa tumpang tindih, jumlah peluangnya tepat $1$.

Gunakan komplemen pada soal "paling sedikit satu", karena menghitung lawannya ("tidak ada sama sekali") lebih singkat.`,
    rumus: [r`P(A^c) = 1 - P(A)`],
    contoh: r`Tiga koin dilempar bersamaan. Berapa peluang muncul paling sedikit satu angka?`,
    bahas: r`Lawannya adalah tidak muncul angka sama sekali (GGG). Karena $n(S)=2^3=8$, maka $P(GGG)=\frac{1}{8}$.

$P(\text{paling sedikit satu angka}) = 1-\frac{1}{8}=\frac{7}{8}$.` },

  // ===================== FREKUENSI HARAPAN =====================
  { id: 'frekuensi-harapan', kat: 'fh', judul: 'Frekuensi Harapan',
    isi: r`Frekuensi harapan ($F_h$) menaksir berapa kali kejadian $A$ muncul jika percobaan diulang $n$ kali. Makin besar $n$, hasil percobaan nyata cenderung makin dekat ke $F_h$.

Dengan $P(A)$ peluang kejadian $A$ dan $n$ banyak percobaan.`,
    rumus: [r`F_h = P(A) \times n`],
    contoh: r`Sebuah dadu dilempar 120 kali. Berapa frekuensi harapan muncul bilangan prima?`,
    bahas: r`Bilangan prima pada dadu adalah $\{2,3,5\}$, sehingga $P(A)=\frac{3}{6}=\frac{1}{2}$.

$F_h=\frac{1}{2}\times 120=60$ kali.` },

  // ===================== MAJEMUK =====================
  { id: 'saling-lepas', kat: 'majemuk', judul: 'Kejadian Saling Lepas dan Tidak Saling Lepas',
    isi: r`Dua kejadian saling lepas tidak dapat terjadi bersamaan ($A\cap B=\emptyset$), sehingga peluang gabungannya langsung dijumlahkan.

Jika keduanya dapat terjadi bersamaan (tidak saling lepas), peluang irisannya ikut terhitung dua kali sehingga harus dikurangi sekali.`,
    rumus: [r`\text{Saling lepas: } P(A\cup B)=P(A)+P(B)`, r`\text{Tidak saling lepas: } P(A\cup B)=P(A)+P(B)-P(A\cap B)`],
    contoh: r`Sebuah dadu dilempar sekali. Berapa peluang muncul bilangan genap atau bilangan prima?`,
    bahas: r`Genap $=\{2,4,6\}$, prima $=\{2,3,5\}$, dan irisannya $=\{2\}$ (tidak saling lepas).

$P=\frac{3}{6}+\frac{3}{6}-\frac{1}{6}=\frac{5}{6}$.` },

  { id: 'saling-bebas', kat: 'majemuk', judul: 'Kejadian Saling Bebas dan Tidak Saling Bebas',
    isi: r`Dua kejadian saling bebas jika terjadinya $A$ tidak mengubah peluang $B$, seperti pelemparan dadu dan koin atau pengambilan dengan pengembalian.

Jika terjadinya $A$ mengubah ruang sampel untuk $B$ (tidak saling bebas, seperti pengambilan tanpa pengembalian), hitung peluang $B$ dengan syarat $A$ sudah terjadi.`,
    rumus: [r`\text{Saling bebas: } P(A\cap B)=P(A)\times P(B)`, r`\text{Tidak saling bebas: } P(A\cap B)=P(A)\times P(B\mid A)`],
    contoh: r`Kotak berisi 4 bola merah dan 6 bola putih. Dua bola diambil satu per satu tanpa pengembalian. Berapa peluang bola pertama merah dan kedua putih?`,
    bahas: r`Pengambilan pertama merah: $P(M)=\frac{4}{10}$. Tersisa 9 bola berisi 6 putih, sehingga $P(P\mid M)=\frac{6}{9}$.

$P=\frac{4}{10}\times\frac{6}{9}=\frac{4}{15}$. (Jika dengan pengembalian: $\frac{4}{10}\times\frac{6}{10}=\frac{6}{25}$.)` },

  { id: 'bersyarat', kat: 'majemuk', judul: 'Peluang Bersyarat',
    isi: r`Peluang bersyarat $P(A\mid B)$ mengukur peluang $A$ terjadi setelah $B$ dipastikan terjadi. Ruang sampel menyempit dari $S$ menjadi $B$ saja.

Syarat: $P(B)>0$, dengan $P(A\cap B)$ peluang $A$ dan $B$ terjadi bersamaan.`,
    rumus: [r`P(A\mid B)=\frac{P(A\cap B)}{P(B)}`],
    contoh: r`Sebuah dadu dilempar sekali. Jika diketahui hasilnya genap, berapa peluang hasilnya 6?`,
    bahas: r`Ruang sampel menyempit ke $B=\{2,4,6\}$ dengan $P(B)=\frac{3}{6}$. Irisannya $A\cap B=\{6\}$ berpeluang $\frac{1}{6}$.

$P(A\mid B)=\frac{1/6}{3/6}=\frac{1}{3}$.` },

  // ===================== PERMUTASI & KOMBINASI =====================
  { id: 'permutasi', kat: 'pk', judul: 'Permutasi',
    isi: r`Permutasi menghitung banyak cara menyusun $r$ objek dari $n$ objek berbeda dengan memperhatikan urutan ($AB$ berbeda dari $BA$).

Dipakai ketika posisi atau peran berbeda (seperti ketua, sekretaris, dan bendahara), dengan $n!=n\times(n-1)\times\dots\times1$ dan $0!=1$.`,
    rumus: [r`P(n,r)=\frac{n!}{(n-r)!}`],
    contoh: r`Dari 6 orang dipilih ketua, sekretaris, dan bendahara. Berapa susunan yang mungkin?`,
    bahas: r`Karena jabatan berbeda, urutan menentukan hasil. $P(6,3)=\frac{6!}{3!}=6\times5\times4=120$.` },

  { id: 'kombinasi', kat: 'pk', judul: 'Kombinasi',
    isi: r`Kombinasi menghitung banyak cara memilih $r$ objek dari $n$ objek berbeda tanpa memperhatikan urutan ($AB$ sama dengan $BA$), dengan hubungan $P(n,r)=r!\,C(n,r)$.

Dalam peluang, kombinasi menghitung $n(A)$ dan $n(S)$ saat beberapa objek diambil sekaligus.`,
    rumus: [r`C(n,r)=\frac{n!}{r!\,(n-r)!}`],
    contoh: r`Kantong berisi 5 bola merah dan 3 bola biru. Diambil 2 bola sekaligus. Berapa peluang keduanya merah?`,
    bahas: r`Banyak pasangan total $n(S)=C(8,2)=28$ dan pasangan merah $n(A)=C(5,2)=10$.

$P=\frac{10}{28}=\frac{5}{14}$.` },

  // ===================== DISTRIBUSI DISKRIT =====================
  { id: 'pengantar-distribusi', kat: 'diskrit', judul: 'Pengantar Distribusi Peluang',
    isi: r`Variabel acak $X$ memetakan setiap hasil percobaan ke suatu bilangan. Distribusi peluang menjelaskan cara peluang tersebar pada nilai-nilai $X$.

- Diskrit: $X$ bernilai terhitung ($0,1,2,\dots$), dengan fungsi massa peluang $P(X=x)$ dan $\sum P(x)=1$.
- Kontinu: $X$ bernilai dalam interval real, dengan fungsi kepadatan $f(x)$. Peluang adalah luas di bawah kurva (total luas $=1$), dan pada satu titik tepat $P(X=x)=0$.

Dua ukuran utamanya adalah nilai harapan $E(X)$ (pusat sebaran) dan varians $\mathrm{Var}(X)$ (keragaman), dengan simpangan baku $\sigma=\sqrt{\mathrm{Var}(X)}$.`,
    rumus: [r`E(X)=\sum x\,P(x)`, r`\mathrm{Var}(X)=E(X^2)-[E(X)]^2`],
    contoh: r`Dua koin dilempar. $X$ = banyak gambar. Tentukan distribusi $X$ dan $E(X)$.`,
    bahas: r`Peluang tiap nilai: $P(0)=\frac{1}{4}$, $P(1)=\frac{2}{4}$, $P(2)=\frac{1}{4}$ (jumlahnya $1$).

$E(X)=0\cdot\frac{1}{4}+1\cdot\frac{2}{4}+2\cdot\frac{1}{4}=1$.` },

  { id: 'seragam-diskrit', kat: 'diskrit', judul: 'Distribusi Seragam Diskrit',
    isi: r`Setiap hasil dari $n$ nilai berhingga ($1,2,\dots,n$) memiliki peluang sama besar $\frac{1}{n}$, misalnya pelemparan dadu seimbang.`,
    rumus: [r`P(X=x)=\frac{1}{n}`, r`E(X)=\frac{n+1}{2},\quad \mathrm{Var}(X)=\frac{n^2-1}{12}`],
    contoh: r`Tentukan $E(X)$ dan $\mathrm{Var}(X)$ untuk mata dadu seimbang.`,
    bahas: r`Untuk $n=6$: $E(X)=\frac{7}{2}=3{,}5$ dan $\mathrm{Var}(X)=\frac{36-1}{12}=\frac{35}{12}\approx2{,}92$.` },

  { id: 'bernoulli', kat: 'diskrit', judul: 'Distribusi Bernoulli',
    isi: r`Satu percobaan tunggal dengan dua hasil: sukses ($x=1$) berpeluang $p$, atau gagal ($x=0$) berpeluang $1-p$. Model dasar ini membentuk distribusi binomial, geometrik, dan binomial negatif.`,
    rumus: [r`P(X=x)=p^{x}(1-p)^{1-x},\quad x\in\{0,1\}`, r`E(X)=p,\quad \mathrm{Var}(X)=p(1-p)`],
    contoh: r`Peluang seorang mahasiswa lulus ujian adalah 0,8. Tentukan rata-rata dan varians.`,
    bahas: r`$E(X)=p=0{,}8$ dan $\mathrm{Var}(X)=0{,}8\times0{,}2=0{,}16$.` },

  { id: 'binomial', kat: 'diskrit', judul: 'Distribusi Binomial',
    isi: r`Menghitung peluang tepat $x$ sukses dalam $n$ percobaan Bernoulli. Syaratnya: banyak percobaan $n$ tetap, tiap percobaan hanya memiliki dua hasil, peluang sukses $p$ konstan, dan setiap percobaan saling bebas. Faktor $C(n,x)$ menghitung banyak cara memilih posisi $x$ sukses.`,
    rumus: [r`P(X=x)=C(n,x)\,p^{x}(1-p)^{n-x}`, r`E(X)=np,\quad \mathrm{Var}(X)=np(1-p)`],
    contoh: r`Koin seimbang dilempar 4 kali. Berapa peluang tepat 2 gambar? Untuk $n=10$ dan $p=0{,}3$, tentukan mean dan varians.`,
    bahas: r`Pada 4 lemparan: $C(4,2)=6$, sehingga $P(X=2)=6\times(0{,}5)^2(0{,}5)^2=\frac{6}{16}=0{,}375$.

Untuk $n=10, p=0{,}3$: $E(X)=10\times0{,}3=3$ dan $\mathrm{Var}(X)=10\times0{,}3\times0{,}7=2{,}1$.` },

  { id: 'geometrik', kat: 'diskrit', judul: 'Distribusi Geometrik',
    isi: r`Variabel $X$ menyatakan nomor percobaan saat sukses pertama muncul ($x=1,2,3,\dots$). Artinya $x-1$ percobaan awal gagal, lalu percobaan ke-$x$ sukses dengan peluang $p$ tetap dan saling bebas.`,
    rumus: [r`P(X=x)=(1-p)^{x-1}\,p`, r`E(X)=\frac{1}{p},\quad \mathrm{Var}(X)=\frac{1-p}{p^2}`],
    contoh: r`Dadu dilempar berulang. Berapa peluang angka 6 pertama muncul pada lemparan ke-4, dan berapa rata-rata lemparan yang dibutuhkan?`,
    bahas: r`Dengan $p=\frac{1}{6}$: $P(X=4)=\left(\frac{5}{6}\right)^3\cdot\frac{1}{6}=\frac{125}{1296}\approx0{,}0965$.

Rata-rata lemparan: $E(X)=\frac{1}{1/6}=6$ lemparan.` },

  { id: 'binomial-negatif', kat: 'diskrit', judul: 'Distribusi Binomial Negatif',
    isi: r`Perluasan distribusi geometrik: $X$ adalah nomor percobaan tempat sukses ke-$r$ muncul ($x=r,r+1,\dots$). Jika $r=1$, bentuknya kembali menjadi distribusi geometrik.`,
    rumus: [r`P(X=x)=C(x-1,\,r-1)\,p^{r}(1-p)^{x-r}`, r`E(X)=\frac{r}{p},\quad \mathrm{Var}(X)=\frac{r(1-p)}{p^2}`],
    contoh: r`Koin seimbang dilempar berulang. Berapa peluang gambar ke-3 muncul tepat pada lemparan ke-5?`,
    bahas: r`Untuk $r=3$, $x=5$, dan $p=0{,}5$: $P=C(4,2)(0{,}5)^3(0{,}5)^2=6\times0{,}03125=0{,}1875$.

Empat lemparan pertama harus memuat tepat 2 gambar ($6$ cara), lalu lemparan ke-5 menghasilkan gambar.` },

  { id: 'hipergeometrik', kat: 'diskrit', judul: 'Distribusi Hipergeometrik',
    isi: r`Mirip binomial, tetapi sampel ukuran $n$ diambil tanpa pengembalian dari populasi berhingga berukuran $N$ yang memiliki $K$ anggota sukses (untuk $x$ sukses dalam sampel). Peluang berubah tiap pengambilan karena ukuran populasi berkurang.`,
    rumus: [r`P(X=x)=\frac{C(K,x)\,C(N-K,\,n-x)}{C(N,n)}`, r`E(X)=\frac{nK}{N}`],
    contoh: r`Kotak berisi 10 bola (4 merah). Diambil 3 bola sekaligus. Berapa peluang tepat 2 merah, dan berapa rata-rata bola merah terambil?`,
    bahas: r`Dengan $N=10$, $K=4$, $n=3$, $x=2$: $P=\frac{C(4,2)\,C(6,1)}{C(10,3)}=\frac{6\times6}{120}=0{,}3$.

Rata-rata terambil: $E(X)=\frac{3\times4}{10}=1{,}2$.` },

  { id: 'poisson', kat: 'diskrit', judul: 'Distribusi Poisson',
    isi: r`Menghitung banyak kejadian acak pada selang waktu atau ruang tetap dengan rata-rata kemunculan $\lambda$ yang konstan dan saling bebas. Ciri khasnya: mean dan varians bernilai sama ($\lambda$).

Poisson juga mendekati distribusi binomial bila $n$ besar dan $p$ kecil dengan $\lambda=np$.`,
    rumus: [r`P(X=x)=\frac{e^{-\lambda}\lambda^{x}}{x!},\quad x=0,1,2,\dots`, r`E(X)=\mathrm{Var}(X)=\lambda`],
    contoh: r`Rata-rata 3 panggilan masuk per jam. Berapa peluang tepat 2 panggilan dalam sejam, dan berapa peluang tidak ada panggilan?`,
    bahas: r`Dengan $\lambda=3$: $P(X=2)=\frac{e^{-3}\cdot 3^2}{2!}=\frac{0{,}0498\times9}{2}\approx0{,}224$.

$P(X=0)=e^{-3}\approx0{,}0498$.` },

  // ===================== DISTRIBUSI KONTINU =====================
  { id: 'seragam-kontinu', kat: 'kontinu', judul: 'Distribusi Seragam Kontinu',
    isi: r`Variabel kontinu $X$ tersebar merata pada interval $[a,b]$ sehingga kurva kepadatannya berbentuk persegi panjang. Peluang suatu sub-interval sebanding langsung dengan panjangnya.`,
    rumus: [r`f(x)=\frac{1}{b-a},\quad a\le x\le b`, r`E(X)=\frac{a+b}{2},\quad \mathrm{Var}(X)=\frac{(b-a)^2}{12}`],
    contoh: r`Bus tiba merata antara 0 sampai 20 menit dari sekarang. Berapa peluang menunggu kurang dari 5 menit, dan berapa rata-rata waktu tunggu?`,
    bahas: r`$P(X<5)=\frac{5-0}{20-0}=0{,}25$, dan rata-rata waktu tunggu $E(X)=\frac{0+20}{2}=10$ menit.` },

  { id: 'eksponensial', kat: 'kontinu', judul: 'Distribusi Eksponensial',
    isi: r`Memodelkan waktu tunggu antar kejadian pada proses Poisson berlaju $\lambda$ per satuan waktu. Sifat tanpa ingatan berarti peluang menunggu tambahan tidak bergantung pada lama waktu tunggu sebelumnya.`,
    rumus: [r`f(x)=\lambda e^{-\lambda x},\ x\ge0`, r`P(X>x)=e^{-\lambda x},\quad E(X)=\frac{1}{\lambda},\quad \mathrm{Var}(X)=\frac{1}{\lambda^2}`],
    contoh: r`Waktu antar kedatangan pelanggan rata-rata 10 menit. Berapa peluang selang waktu lebih dari 20 menit?`,
    bahas: r`Karena $E(X)=10$, diperoleh $\lambda=0{,}1$. Maka $P(X>20)=e^{-0{,}1\times20}=e^{-2}\approx0{,}1353$.` },

  { id: 'normal', kat: 'kontinu', judul: 'Distribusi Normal',
    isi: r`Distribusi kurva lonceng simetris yang ditentukan mean $\mu$ (pusat) dan simpangan baku $\sigma$ (lebar), dengan mean = median = modus.

Aturan empiris: sekitar $68\%$ data berada dalam $\mu\pm\sigma$, $95\%$ dalam $\mu\pm2\sigma$, dan $99{,}7\%$ dalam $\mu\pm3\sigma$. Hitung peluangnya dengan membakukan $X$ ke skor-$z$ lalu membaca tabel normal baku.`,
    rumus: [r`f(x)=\frac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}`, r`z=\frac{X-\mu}{\sigma}`],
    contoh: r`Nilai ujian berdistribusi normal dengan $\mu=60$ dan $\sigma=10$. Berapa peluang nilai di atas 70, dan peluang nilai antara 50 dan 70?`,
    bahas: r`Skor baku $z=\frac{70-60}{10}=1$. Maka $P(X>70)=P(Z>1)=1-0{,}8413=0{,}1587$.

$P(50<X<70)=P(-1<Z<1)=0{,}6826$ (sesuai aturan 68%).` },

  { id: 'gamma', kat: 'kontinu', judul: 'Distribusi Gamma',
    isi: r`Memodelkan total waktu tunggu hingga kejadian ke-$\alpha$ pada proses Poisson berlaju $\lambda$. Parameternya bentuk $\alpha>0$ dan laju $\lambda>0$; saat $\alpha=1$, distribusi ini menjadi eksponensial, dan untuk $\alpha$ bulat berlaku $\Gamma(\alpha)=(\alpha-1)!$.`,
    rumus: [r`f(x)=\frac{\lambda^{\alpha}x^{\alpha-1}e^{-\lambda x}}{\Gamma(\alpha)},\ x>0`, r`E(X)=\frac{\alpha}{\lambda},\quad \mathrm{Var}(X)=\frac{\alpha}{\lambda^2}`],
    contoh: r`$X\sim\text{Gamma}(\alpha=3,\ \lambda=0{,}5)$. Tentukan mean dan varians.`,
    bahas: r`$E(X)=\frac{3}{0{,}5}=6$ dan $\mathrm{Var}(X)=\frac{3}{0{,}25}=12$.` },

  { id: 'chi-kuadrat', kat: 'kontinu', judul: 'Distribusi Chi-Kuadrat',
    isi: r`Jumlah kuadrat $k$ variabel normal baku saling bebas, berparameter derajat bebas $k$. Kurvanya bernilai positif dan miring ke kanan (kasus khusus Gamma), dipakai pada uji kecocokan, uji kebebasan, dan inferensi varians.`,
    rumus: [r`\chi^2=Z_1^2+Z_2^2+\dots+Z_k^2`, r`E(\chi^2)=k,\quad \mathrm{Var}(\chi^2)=2k`],
    contoh: r`$Z_1,Z_2,Z_3$ normal baku bebas dan $Q=Z_1^2+Z_2^2+Z_3^2$. Tentukan distribusi, mean, dan varians $Q$.`,
    bahas: r`$Q\sim\chi^2(3)$ dengan $k=3$, sehingga $E(Q)=3$ dan $\mathrm{Var}(Q)=2\times3=6$.` },

  { id: 't-student', kat: 'kontinu', judul: 'Distribusi t-Student',
    isi: r`Kurva lonceng simetris berpusat $0$ seperti normal baku, namun berekor lebih tebal untuk sampel kecil saat $\sigma$ populasi tidak diketahui. Di sini $\bar{x}$ adalah rata-rata sampel, $s$ simpangan baku sampel, $n$ ukuran sampel, dan derajat bebas $k=n-1$; makin besar $k$, kurva makin mendekati normal baku.`,
    rumus: [r`t=\frac{\bar{x}-\mu}{s/\sqrt{n}}`, r`E(T)=0\ (k>1),\quad \mathrm{Var}(T)=\frac{k}{k-2}\ (k>2)`],
    contoh: r`Sampel $n=16$ dengan $\bar{x}=52$, $s=8$, dan hipotesis $\mu=50$. Hitung nilai $t$ dan derajat bebasnya.`,
    bahas: r`$t=\frac{52-50}{8/\sqrt{16}}=\frac{2}{2}=1$, dengan derajat bebas $16-1=15$.` },

  { id: 'f-distribusi', kat: 'kontinu', judul: 'Distribusi F',
    isi: r`Rasio dua variabel chi-kuadrat saling bebas yang masing-masing dibagi derajat bebasnya ($d_1$ pembilang, $d_2$ penyebut). Nilainya positif dan miring ke kanan, dipakai pada ANOVA serta uji kesamaan dua varians.`,
    rumus: [r`F=\frac{U/d_1}{V/d_2},\quad U\sim\chi^2(d_1),\ V\sim\chi^2(d_2)`, r`E(F)=\frac{d_2}{d_2-2}\ (d_2>2)`],
    contoh: r`Dua sampel memiliki varians $s_1^2=25$ dan $s_2^2=10$. Hitung statistik $F=s_1^2/s_2^2$ dan nilai harapan $F$ bila $d_2=10$.`,
    bahas: r`$F=\frac{25}{10}=2{,}5$, dan $E(F)=\frac{10}{10-2}=1{,}25$.` },
];
