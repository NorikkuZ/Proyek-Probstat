// js/materi.js
// Data kategori dan materi pembelajaran.
// - Rumus ditulis dalam LaTeX (dirender KaTeX). r`...` = String.raw agar tanda "\" tidak hilang.
// - Di dalam teks, rumus inline ditulis di antara tanda $ ... $.
// - Untuk MENAMBAH materi baru: salin satu blok { ... } di MATERI, lalu ubah isinya.

const r = String.raw;

const KATEGORI = [
  { id: 'dasar',     nama: 'Konsep Dasar Peluang',     ikon: '🎲', desk: 'Ruang sampel, kejadian, dan peluang kejadian tunggal.' },
  { id: 'komplemen', nama: 'Komplemen Kejadian',       ikon: '🔄', desk: 'Kejadian "bukan A" dan hubungannya dengan peluang A.' },
  { id: 'fh',        nama: 'Frekuensi Harapan',        ikon: '📈', desk: 'Perkiraan banyak kejadian muncul dalam n percobaan.' },
  { id: 'majemuk',   nama: 'Peluang Kejadian Majemuk', ikon: '🧩', desk: 'Saling lepas, saling bebas, dan peluang bersyarat.' },
  { id: 'pk',        nama: 'Permutasi dan Kombinasi',  ikon: '🔢', desk: 'Teknik membilang dengan atau tanpa memperhatikan urutan.' },
  { id: 'diskrit',   nama: 'Distribusi Diskrit',       ikon: '📊', desk: 'Seragam, Bernoulli, Binomial, Geometrik, Binomial Negatif, Hipergeometrik, Poisson.' },
  { id: 'kontinu',   nama: 'Distribusi Kontinu',       ikon: '🔔', desk: 'Seragam, Eksponensial, Normal, Gamma, Chi-Kuadrat, t-Student, F.' },
];

const MATERI = [
  // ===================== KONSEP DASAR =====================
  { id: 'konsep-dasar', kat: 'dasar', judul: 'Konsep Dasar Peluang',
    isi: r`Peluang adalah ukuran kemungkinan suatu kejadian terjadi. Nilainya antara 0 (mustahil) dan 1 (pasti).

- Ruang sampel (S): himpunan semua hasil yang mungkin.
- Titik sampel: setiap anggota ruang sampel.
- Kejadian (A): himpunan bagian dari S yang kita inginkan.

Keterangan: $n(A)$ = banyak anggota A, $n(S)$ = banyak anggota S. Rumus ini berlaku bila setiap hasil sama kemungkinannya.`,
    rumus: [r`P(A) = \frac{n(A)}{n(S)}`],
    contoh: r`Sebuah dadu dilempar sekali. Berapa peluang muncul mata dadu lebih dari 4? Berapa peluang koin yang dilempar sekali menunjukkan gambar?`,
    bahas: r`Dadu: $S=\{1,2,3,4,5,6\}$ sehingga $n(S)=6$. $A=\{5,6\}$ sehingga $n(A)=2$. $P(A)=\frac{2}{6}=\frac{1}{3}$.

Koin: $S=\{A,G\}$, $n(S)=2$, $A=\{G\}$, $n(A)=1$. $P=\frac{1}{2}$.` },

  // ===================== KOMPLEMEN =====================
  { id: 'komplemen', kat: 'komplemen', judul: 'Komplemen Kejadian',
    isi: r`Komplemen dari A, ditulis $A^c$ ("bukan A"), adalah semua titik sampel dalam S yang tidak termasuk A. Karena A dan $A^c$ bersama-sama mencakup seluruh S, jumlah peluangnya 1.

Komplemen sangat berguna untuk soal "paling sedikit satu", karena menghitung kebalikannya biasanya lebih mudah.`,
    rumus: [r`P(A^c) = 1 - P(A)`],
    contoh: r`Tiga koin dilempar bersamaan. Berapa peluang muncul paling sedikit satu angka?`,
    bahas: r`Komplemennya: tidak ada angka (GGG). $n(S)=2^3=8$, jadi $P(GGG)=\frac{1}{8}$.

$P(\text{paling sedikit satu angka}) = 1-\frac{1}{8}=\frac{7}{8}$.` },

  // ===================== FREKUENSI HARAPAN =====================
  { id: 'frekuensi-harapan', kat: 'fh', judul: 'Frekuensi Harapan',
    isi: r`Frekuensi harapan adalah perkiraan banyaknya kejadian A muncul jika percobaan dilakukan n kali. Makin besar n, hasil percobaan nyata cenderung makin dekat ke nilai ini.

Keterangan: $F_h$ = frekuensi harapan, $P(A)$ = peluang A, $n$ = banyak percobaan.`,
    rumus: [r`F_h = P(A) \times n`],
    contoh: r`Sebuah dadu dilempar 120 kali. Berapa frekuensi harapan muncul bilangan prima?`,
    bahas: r`Prima pada dadu: $\{2,3,5\}$, jadi $P(A)=\frac{3}{6}=\frac{1}{2}$.

$F_h=\frac{1}{2}\times 120=60$ kali.` },

  // ===================== MAJEMUK =====================
  { id: 'saling-lepas', kat: 'majemuk', judul: 'Kejadian Saling Lepas dan Tidak Saling Lepas',
    isi: r`Saling lepas: A dan B tidak mungkin terjadi bersamaan ($A\cap B=\emptyset$). Peluang gabungannya cukup dijumlahkan.

Tidak saling lepas: A dan B dapat terjadi bersamaan. Irisannya terhitung dua kali sehingga harus dikurangi sekali.`,
    rumus: [r`\text{Saling lepas: } P(A\cup B)=P(A)+P(B)`, r`\text{Tidak saling lepas: } P(A\cup B)=P(A)+P(B)-P(A\cap B)`],
    contoh: r`Sebuah dadu dilempar sekali. Berapa peluang muncul bilangan genap atau bilangan prima?`,
    bahas: r`Genap $=\{2,4,6\}$, prima $=\{2,3,5\}$, irisan $=\{2\}$ (tidak saling lepas).

$P=\frac{3}{6}+\frac{3}{6}-\frac{1}{6}=\frac{5}{6}$.` },

  { id: 'saling-bebas', kat: 'majemuk', judul: 'Kejadian Saling Bebas dan Tidak Saling Bebas',
    isi: r`Saling bebas: terjadinya A tidak mempengaruhi peluang B (contoh: dadu dan koin, atau pengambilan dengan pengembalian).

Tidak saling bebas (bergantung): terjadinya A mengubah peluang B (contoh: pengambilan tanpa pengembalian), sehingga peluang B harus dihitung ulang setelah A terjadi.`,
    rumus: [r`\text{Saling bebas: } P(A\cap B)=P(A)\times P(B)`, r`\text{Tidak saling bebas: } P(A\cap B)=P(A)\times P(B\mid A)`],
    contoh: r`Kotak berisi 4 bola merah dan 6 bola putih. Dua bola diambil satu per satu TANPA pengembalian. Berapa peluang bola pertama merah dan kedua putih?`,
    bahas: r`Pengambilan pertama: $P(M)=\frac{4}{10}$. Setelah itu tersisa 9 bola (6 putih): $P(P\mid M)=\frac{6}{9}$.

$P=\frac{4}{10}\times\frac{6}{9}=\frac{4}{15}$. (Jika dengan pengembalian: $\frac{4}{10}\times\frac{6}{10}=\frac{6}{25}$.)` },

  { id: 'bersyarat', kat: 'majemuk', judul: 'Peluang Bersyarat',
    isi: r`$P(A\mid B)$ adalah peluang A terjadi jika B sudah terjadi. Ruang sampelnya "menyempit" menjadi B saja.

Keterangan: $P(A\cap B)$ = peluang A dan B terjadi bersamaan, $P(B)>0$.`,
    rumus: [r`P(A\mid B)=\frac{P(A\cap B)}{P(B)}`],
    contoh: r`Sebuah dadu dilempar sekali. Jika diketahui hasilnya genap, berapa peluang hasilnya 6?`,
    bahas: r`$B=\{2,4,6\}$, $P(B)=\frac{3}{6}$. $A\cap B=\{6\}$, $P(A\cap B)=\frac{1}{6}$.

$P(A\mid B)=\frac{1/6}{3/6}=\frac{1}{3}$.` },

  // ===================== PERMUTASI & KOMBINASI =====================
  { id: 'permutasi', kat: 'pk', judul: 'Permutasi',
    isi: r`Permutasi adalah banyak cara menyusun $r$ objek dari $n$ objek berbeda DENGAN memperhatikan urutan (AB berbeda dengan BA).

Keterangan: $n!=n\times(n-1)\times\dots\times1$ dan $0!=1$. Permutasi dipakai bila urutan menentukan kejadian, misalnya pemilihan ketua, sekretaris, dan bendahara.`,
    rumus: [r`P(n,r)=\frac{n!}{(n-r)!}`],
    contoh: r`Dari 6 orang dipilih ketua, sekretaris, dan bendahara. Berapa susunan yang mungkin?`,
    bahas: r`Jabatan berbeda, urutan penting. $P(6,3)=\frac{6!}{3!}=6\times5\times4=120$.` },

  { id: 'kombinasi', kat: 'pk', judul: 'Kombinasi',
    isi: r`Kombinasi adalah banyak cara memilih $r$ objek dari $n$ objek TANPA memperhatikan urutan (AB sama dengan BA). Hubungannya: $P(n,r)=r!\,C(n,r)$.

Dalam peluang, kombinasi dipakai untuk menghitung $n(A)$ dan $n(S)$ pada pengambilan beberapa objek sekaligus.`,
    rumus: [r`C(n,r)=\frac{n!}{r!\,(n-r)!}`],
    contoh: r`Kantong berisi 5 bola merah dan 3 bola biru. Diambil 2 bola sekaligus. Berapa peluang keduanya merah?`,
    bahas: r`$n(S)=C(8,2)=28$ dan $n(A)=C(5,2)=10$.

$P=\frac{10}{28}=\frac{5}{14}$.` },

  // ===================== DISTRIBUSI DISKRIT =====================
  { id: 'pengantar-distribusi', kat: 'diskrit', judul: 'Pengantar Distribusi Peluang',
    isi: r`Variabel acak $X$ adalah angka yang mewakili hasil suatu percobaan acak. Distribusi peluang menyatakan bagaimana peluang tersebar pada nilai-nilai $X$.

- Diskrit: $X$ bernilai terhitung (0, 1, 2, ...). Peluang tiap nilai disebut fungsi massa peluang, $P(X=x)$, dan $\sum P(x)=1$.
- Kontinu: $X$ bernilai sembarang bilangan dalam interval. Digunakan fungsi kepadatan $f(x)$; peluang adalah LUAS di bawah kurva, dan total luas = 1. Untuk kontinu, $P(X=x)=0$.

Dua ukuran utama: nilai harapan (rata-rata) $E(X)$ dan varians $\mathrm{Var}(X)$. Standar deviasi $\sigma=\sqrt{\mathrm{Var}(X)}$.`,
    rumus: [r`E(X)=\sum x\,P(x)`, r`\mathrm{Var}(X)=E(X^2)-[E(X)]^2`],
    contoh: r`Dua koin dilempar. $X$ = banyak gambar. Tentukan distribusi $X$ dan $E(X)$.`,
    bahas: r`$P(0)=\frac{1}{4}$, $P(1)=\frac{2}{4}$, $P(2)=\frac{1}{4}$ (jumlahnya 1).

$E(X)=0\cdot\frac{1}{4}+1\cdot\frac{2}{4}+2\cdot\frac{1}{4}=1$.` },

  { id: 'seragam-diskrit', kat: 'diskrit', judul: 'Distribusi Seragam Diskrit',
    isi: r`Setiap dari $n$ nilai ($1,2,\dots,n$) memiliki peluang sama. Contoh: pelemparan dadu seimbang.`,
    rumus: [r`P(X=x)=\frac{1}{n}`, r`E(X)=\frac{n+1}{2},\quad \mathrm{Var}(X)=\frac{n^2-1}{12}`],
    contoh: r`Tentukan $E(X)$ dan $\mathrm{Var}(X)$ untuk mata dadu seimbang.`,
    bahas: r`$n=6$. $E(X)=\frac{7}{2}=3{,}5$. $\mathrm{Var}(X)=\frac{36-1}{12}=\frac{35}{12}\approx2{,}92$.` },

  { id: 'bernoulli', kat: 'diskrit', judul: 'Distribusi Bernoulli',
    isi: r`Satu percobaan dengan dua hasil: sukses ($x=1$) dengan peluang $p$, atau gagal ($x=0$) dengan peluang $1-p$. Ini adalah "batu bata" dari distribusi binomial, geometrik, dan binomial negatif.`,
    rumus: [r`P(X=x)=p^{x}(1-p)^{1-x},\quad x\in\{0,1\}`, r`E(X)=p,\quad \mathrm{Var}(X)=p(1-p)`],
    contoh: r`Peluang seorang mahasiswa lulus ujian adalah 0,8. Tentukan rata-rata dan varians.`,
    bahas: r`$E(X)=p=0{,}8$. $\mathrm{Var}(X)=0{,}8\times0{,}2=0{,}16$.` },

  { id: 'binomial', kat: 'diskrit', judul: 'Distribusi Binomial',
    isi: r`Menghitung peluang tepat $x$ sukses dari $n$ percobaan Bernoulli. Syarat: (1) $n$ tetap, (2) tiap percobaan dua hasil, (3) peluang sukses $p$ konstan, (4) percobaan saling bebas.

Keterangan: $C(n,x)$ = banyak cara memilih posisi $x$ sukses.`,
    rumus: [r`P(X=x)=C(n,x)\,p^{x}(1-p)^{n-x}`, r`E(X)=np,\quad \mathrm{Var}(X)=np(1-p)`],
    contoh: r`Koin seimbang dilempar 4 kali. Berapa peluang tepat 2 gambar? Untuk $n=10$ dan $p=0{,}3$, tentukan mean dan varians.`,
    bahas: r`$C(4,2)=6$. $P(X=2)=6\times(0{,}5)^2(0{,}5)^2=\frac{6}{16}=0{,}375$.

$E(X)=10\times0{,}3=3$. $\mathrm{Var}(X)=10\times0{,}3\times0{,}7=2{,}1$.` },

  { id: 'geometrik', kat: 'diskrit', judul: 'Distribusi Geometrik',
    isi: r`$X$ = nomor percobaan tempat sukses PERTAMA muncul, dengan peluang sukses $p$ pada tiap percobaan bebas ($x=1,2,3,\dots$). Contoh: melempar dadu sampai muncul angka 6.`,
    rumus: [r`P(X=x)=(1-p)^{x-1}\,p`, r`E(X)=\frac{1}{p},\quad \mathrm{Var}(X)=\frac{1-p}{p^2}`],
    contoh: r`Dadu dilempar berulang. Berapa peluang angka 6 pertama muncul pada lemparan ke-4, dan berapa rata-rata lemparan yang dibutuhkan?`,
    bahas: r`$p=\frac{1}{6}$. $P(X=4)=\left(\frac{5}{6}\right)^3\cdot\frac{1}{6}=\frac{125}{1296}\approx0{,}0965$.

$E(X)=\frac{1}{1/6}=6$ lemparan.` },

  { id: 'binomial-negatif', kat: 'diskrit', judul: 'Distribusi Binomial Negatif',
    isi: r`Perluasan geometrik: $X$ = nomor percobaan tempat sukses ke-$r$ muncul ($x=r,r+1,\dots$). Jika $r=1$, hasilnya distribusi geometrik. Syarat percobaan sama seperti binomial.`,
    rumus: [r`P(X=x)=C(x-1,\,r-1)\,p^{r}(1-p)^{x-r}`, r`E(X)=\frac{r}{p},\quad \mathrm{Var}(X)=\frac{r(1-p)}{p^2}`],
    contoh: r`Koin seimbang dilempar berulang. Berapa peluang gambar ke-3 muncul tepat pada lemparan ke-5?`,
    bahas: r`$r=3$, $x=5$, $p=0{,}5$. $P=C(4,2)(0{,}5)^3(0{,}5)^2=6\times0{,}03125=0{,}1875$.

Alasannya: pada 4 lemparan pertama harus ada tepat 2 gambar (6 cara), lalu lemparan ke-5 gambar.` },

  { id: 'hipergeometrik', kat: 'diskrit', judul: 'Distribusi Hipergeometrik',
    isi: r`Seperti binomial, tetapi pengambilan TANPA pengembalian dari populasi terbatas sehingga peluang berubah tiap pengambilan.

Keterangan: $N$ = ukuran populasi, $K$ = banyak "sukses" dalam populasi, $n$ = ukuran sampel, $x$ = banyak sukses dalam sampel.`,
    rumus: [r`P(X=x)=\frac{C(K,x)\,C(N-K,\,n-x)}{C(N,n)}`, r`E(X)=\frac{nK}{N}`],
    contoh: r`Kotak berisi 10 bola (4 merah). Diambil 3 bola sekaligus. Berapa peluang tepat 2 merah, dan berapa rata-rata bola merah terambil?`,
    bahas: r`$N=10$, $K=4$, $n=3$, $x=2$. $P=\frac{C(4,2)\,C(6,1)}{C(10,3)}=\frac{6\times6}{120}=0{,}3$.

$E(X)=\frac{3\times4}{10}=1{,}2$.` },

  { id: 'poisson', kat: 'diskrit', judul: 'Distribusi Poisson',
    isi: r`Menghitung banyak kejadian dalam suatu selang waktu/ruang tetap bila kejadian terjadi acak dengan rata-rata $\lambda$ dan saling bebas. Contoh: panggilan telepon per jam, kerusakan per meter kabel. Ciri khasnya: mean = varians = $\lambda$.

Poisson juga bisa mendekati binomial bila $n$ besar dan $p$ kecil dengan $\lambda=np$.`,
    rumus: [r`P(X=x)=\frac{e^{-\lambda}\lambda^{x}}{x!},\quad x=0,1,2,\dots`, r`E(X)=\mathrm{Var}(X)=\lambda`],
    contoh: r`Rata-rata 3 panggilan masuk per jam. Berapa peluang tepat 2 panggilan dalam sejam, dan berapa peluang tidak ada panggilan?`,
    bahas: r`$\lambda=3$. $P(X=2)=\frac{e^{-3}\cdot 3^2}{2!}=\frac{0{,}0498\times9}{2}\approx0{,}224$.

$P(X=0)=e^{-3}\approx0{,}0498$.` },

  // ===================== DISTRIBUSI KONTINU =====================
  { id: 'seragam-kontinu', kat: 'kontinu', judul: 'Distribusi Seragam Kontinu',
    isi: r`$X$ dapat bernilai sembarang di interval $[a,b]$ dengan kepadatan konstan (grafiknya persegi panjang). Peluang suatu interval sebanding dengan panjangnya.`,
    rumus: [r`f(x)=\frac{1}{b-a},\quad a\le x\le b`, r`E(X)=\frac{a+b}{2},\quad \mathrm{Var}(X)=\frac{(b-a)^2}{12}`],
    contoh: r`Bus tiba secara merata antara 0 sampai 20 menit dari sekarang. Berapa peluang menunggu kurang dari 5 menit, dan berapa rata-rata waktu tunggu?`,
    bahas: r`$P(X<5)=\frac{5-0}{20-0}=0{,}25$. $E(X)=\frac{0+20}{2}=10$ menit.` },

  { id: 'eksponensial', kat: 'kontinu', judul: 'Distribusi Eksponensial',
    isi: r`Memodelkan waktu tunggu antar kejadian Poisson, dengan laju $\lambda$ per satuan waktu. Memiliki sifat tanpa ingatan: peluang menunggu tambahan tidak bergantung pada lamanya menunggu sebelumnya.`,
    rumus: [r`f(x)=\lambda e^{-\lambda x},\ x\ge0`, r`P(X>x)=e^{-\lambda x},\quad E(X)=\frac{1}{\lambda},\quad \mathrm{Var}(X)=\frac{1}{\lambda^2}`],
    contoh: r`Waktu antar kedatangan pelanggan rata-rata 10 menit. Berapa peluang selang waktu lebih dari 20 menit?`,
    bahas: r`$E(X)=10$ sehingga $\lambda=0{,}1$. $P(X>20)=e^{-0{,}1\times20}=e^{-2}\approx0{,}1353$.` },

  { id: 'normal', kat: 'kontinu', judul: 'Distribusi Normal',
    isi: r`Berbentuk kurva lonceng simetris, ditentukan oleh mean $\mu$ (pusat) dan standar deviasi $\sigma$ (lebar). Mean = median = modus.

Aturan empiris: sekitar 68% data dalam $\mu\pm\sigma$, 95% dalam $\mu\pm2\sigma$, dan 99,7% dalam $\mu\pm3\sigma$. Untuk menghitung peluang, ubah $X$ menjadi skor-z lalu gunakan tabel normal baku.`,
    rumus: [r`f(x)=\frac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}`, r`z=\frac{X-\mu}{\sigma}`],
    contoh: r`Nilai ujian berdistribusi normal dengan $\mu=60$ dan $\sigma=10$. Berapa peluang nilai di atas 70, dan peluang nilai antara 50 dan 70?`,
    bahas: r`$z=\frac{70-60}{10}=1$. $P(X>70)=P(Z>1)=1-0{,}8413=0{,}1587$.

$P(50<X<70)=P(-1<Z<1)=0{,}6826$ (sesuai aturan 68%).` },

  { id: 'gamma', kat: 'kontinu', judul: 'Distribusi Gamma',
    isi: r`Memodelkan waktu tunggu sampai kejadian ke-$\alpha$ pada proses Poisson dengan laju $\lambda$ (jumlah $\alpha$ variabel eksponensial). Parameter: bentuk $\alpha>0$ dan laju $\lambda>0$. Jika $\alpha=1$ menjadi eksponensial. Untuk bilangan bulat, $\Gamma(\alpha)=(\alpha-1)!$.`,
    rumus: [r`f(x)=\frac{\lambda^{\alpha}x^{\alpha-1}e^{-\lambda x}}{\Gamma(\alpha)},\ x>0`, r`E(X)=\frac{\alpha}{\lambda},\quad \mathrm{Var}(X)=\frac{\alpha}{\lambda^2}`],
    contoh: r`$X\sim\text{Gamma}(\alpha=3,\ \lambda=0{,}5)$. Tentukan mean dan varians.`,
    bahas: r`$E(X)=\frac{3}{0{,}5}=6$. $\mathrm{Var}(X)=\frac{3}{0{,}25}=12$.` },

  { id: 'chi-kuadrat', kat: 'kontinu', judul: 'Distribusi Chi-Kuadrat',
    isi: r`Jumlah kuadrat $k$ variabel normal baku yang saling bebas, dengan derajat bebas $k$. Bentuknya miring ke kanan dan hanya bernilai positif. Merupakan kasus khusus Gamma. Dipakai pada uji kecocokan, uji kebebasan, dan inferensi varians.`,
    rumus: [r`\chi^2=Z_1^2+Z_2^2+\dots+Z_k^2`, r`E(\chi^2)=k,\quad \mathrm{Var}(\chi^2)=2k`],
    contoh: r`$Z_1,Z_2,Z_3$ normal baku bebas dan $Q=Z_1^2+Z_2^2+Z_3^2$. Tentukan distribusi, mean, dan varians $Q$.`,
    bahas: r`$Q\sim\chi^2(3)$ dengan $k=3$. $E(Q)=3$ dan $\mathrm{Var}(Q)=2\times3=6$.` },

  { id: 't-student', kat: 'kontinu', judul: 'Distribusi t-Student',
    isi: r`Mirip normal baku (lonceng, simetris, pusat 0) tetapi ekornya lebih tebal. Dipakai saat menguji rata-rata sampel kecil dengan $\sigma$ populasi tidak diketahui. Makin besar derajat bebas, makin mendekati normal baku.

Keterangan: $\bar{x}$ = rata-rata sampel, $s$ = simpangan baku sampel, $n$ = ukuran sampel, derajat bebas $=n-1$.`,
    rumus: [r`t=\frac{\bar{x}-\mu}{s/\sqrt{n}}`, r`E(T)=0\ (k>1),\quad \mathrm{Var}(T)=\frac{k}{k-2}\ (k>2)`],
    contoh: r`Sampel $n=16$ dengan $\bar{x}=52$, $s=8$, dan hipotesis $\mu=50$. Hitung nilai $t$ dan derajat bebasnya.`,
    bahas: r`$t=\frac{52-50}{8/\sqrt{16}}=\frac{2}{2}=1$. Derajat bebas $=16-1=15$.` },

  { id: 'f-distribusi', kat: 'kontinu', judul: 'Distribusi F',
    isi: r`Perbandingan dua variabel chi-kuadrat yang masing-masing dibagi derajat bebasnya, dengan derajat bebas $d_1$ (pembilang) dan $d_2$ (penyebut). Bernilai positif dan miring ke kanan. Dipakai pada ANOVA dan uji kesamaan dua varians.`,
    rumus: [r`F=\frac{U/d_1}{V/d_2},\quad U\sim\chi^2(d_1),\ V\sim\chi^2(d_2)`, r`E(F)=\frac{d_2}{d_2-2}\ (d_2>2)`],
    contoh: r`Dua sampel memiliki varians $s_1^2=25$ dan $s_2^2=10$. Hitung statistik $F=s_1^2/s_2^2$ dan nilai harapan $F$ bila $d_2=10$.`,
    bahas: r`$F=\frac{25}{10}=2{,}5$. $E(F)=\frac{10}{10-2}=1{,}25$.` },
];
