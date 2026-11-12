// js/soal.js
// Bank soal. Format satu soal:
//   [idKategori, 'pertanyaan', ['opsi A','opsi B','opsi C','opsi D'], indeksJawabanBenar(0-3), 'pembahasan']
// Untuk MENAMBAH soal: tambahkan satu baris baru di dalam array RAW di bawah.
// Urutan soal dan urutan pilihan jawaban diacak otomatis saat kuis dimulai.

const RAW = [
  // ----- Konsep Dasar -----
  ['dasar', 'Sebuah dadu dilempar satu kali. Peluang muncul mata dadu genap adalah ...', ['1/6', '1/3', '1/2', '2/3'], 2, 'Genap = {2,4,6}, n(A)=3 dan n(S)=6, jadi P = 3/6 = 1/2.'],
  ['dasar', 'Banyak anggota ruang sampel pada pelemparan dua dadu bersamaan adalah ...', ['12', '24', '36', '6'], 2, 'Tiap dadu punya 6 hasil: 6 × 6 = 36.'],
  ['dasar', 'Dari 52 kartu bridge diambil satu kartu. Peluang terambil kartu As adalah ...', ['1/52', '1/26', '1/13', '4/13'], 2, 'Ada 4 kartu As: 4/52 = 1/13.'],
  ['dasar', 'Peluang suatu kejadian yang mustahil terjadi adalah ...', ['0', '0,5', '1', 'tak terhingga'], 0, 'Kejadian mustahil tidak punya titik sampel sehingga P = 0.'],
  ['dasar', 'Dua dadu dilempar bersamaan. Peluang jumlah mata dadu 7 adalah ...', ['1/12', '1/6', '1/9', '1/4'], 1, 'Pasangan berjumlah 7 ada 6 dari 36: 6/36 = 1/6.'],

  // ----- Komplemen -----
  ['komplemen', 'Jika P(A) = 0,3 maka P(Aᶜ) adalah ...', ['0,3', '0,7', '1,3', '0,6'], 1, 'P(Aᶜ) = 1 − 0,3 = 0,7.'],
  ['komplemen', 'Peluang hujan besok 2/5. Peluang tidak hujan adalah ...', ['2/5', '3/5', '1/5', '5/2'], 1, '1 − 2/5 = 3/5.'],
  ['komplemen', 'Tiga koin dilempar bersamaan. Peluang muncul paling sedikit satu angka adalah ...', ['1/8', '3/8', '7/8', '1/2'], 2, 'Komplemennya "tidak ada angka" (GGG) = 1/8. Jadi 1 − 1/8 = 7/8.'],
  ['komplemen', 'Jika P(Aᶜ) = 0,25 maka P(A) adalah ...', ['0,25', '0,5', '0,75', '1,25'], 2, 'P(A) = 1 − 0,25 = 0,75.'],
  ['komplemen', 'Dua dadu dilempar. Peluang jumlah kedua mata dadu BUKAN 7 adalah ...', ['1/6', '5/6', '7/36', '29/36'], 1, 'P(jumlah 7) = 1/6, maka P(bukan 7) = 1 − 1/6 = 5/6.'],

  // ----- Frekuensi Harapan -----
  ['fh', 'Dadu dilempar 60 kali. Frekuensi harapan muncul mata dadu 4 adalah ...', ['6', '10', '12', '15'], 1, 'Fh = 1/6 × 60 = 10.'],
  ['fh', 'Koin dilempar 100 kali. Frekuensi harapan muncul gambar adalah ...', ['25', '40', '50', '100'], 2, 'Fh = 1/2 × 100 = 50.'],
  ['fh', 'Peluang hujan tiap hari 0,2. Dalam 30 hari diharapkan hujan sebanyak ... hari.', ['2', '4', '6', '10'], 2, 'Fh = 0,2 × 30 = 6.'],
  ['fh', 'Dua koin dilempar 80 kali. Frekuensi harapan muncul dua angka adalah ...', ['10', '20', '40', '60'], 1, 'P(AA) = 1/4, Fh = 1/4 × 80 = 20.'],
  ['fh', 'Peluang produk cacat 0,05. Dari 400 produk, diperkirakan cacat sebanyak ...', ['5', '10', '20', '40'], 2, 'Fh = 0,05 × 400 = 20.'],

  // ----- Peluang Majemuk -----
  ['majemuk', 'A dan B saling lepas, P(A) = 0,3 dan P(B) = 0,4. Nilai P(A ∪ B) adalah ...', ['0,12', '0,7', '0,1', '1,2'], 1, 'Saling lepas: 0,3 + 0,4 = 0,7.'],
  ['majemuk', 'Diketahui P(A)=0,5; P(B)=0,4; P(A ∩ B)=0,2. Nilai P(A ∪ B) adalah ...', ['0,9', '0,7', '0,1', '0,2'], 1, '0,5 + 0,4 − 0,2 = 0,7.'],
  ['majemuk', 'A dan B saling bebas, P(A)=0,5 dan P(B)=0,6. Nilai P(A ∩ B) adalah ...', ['1,1', '0,1', '0,3', '0,6'], 2, 'Saling bebas: 0,5 × 0,6 = 0,3.'],
  ['majemuk', 'Dua kartu diambil dari 52 kartu tanpa pengembalian. Peluang keduanya As adalah ...', ['1/169', '1/221', '1/13', '2/52'], 1, '4/52 × 3/51 = 12/2652 = 1/221.'],
  ['majemuk', 'Diketahui P(A ∩ B) = 0,2 dan P(B) = 0,5. Nilai P(A|B) adalah ...', ['0,1', '0,4', '0,7', '2,5'], 1, 'P(A|B) = 0,2 / 0,5 = 0,4.'],

  // ----- Permutasi & Kombinasi -----
  ['pk', 'Nilai P(5,2) adalah ...', ['10', '20', '25', '120'], 1, 'P(5,2) = 5!/3! = 5 × 4 = 20.'],
  ['pk', 'Dari 7 siswa dipilih 3 siswa untuk tim (tanpa jabatan). Banyak cara memilih adalah ...', ['21', '35', '210', '42'], 1, 'Urutan tidak penting: C(7,3) = 35.'],
  ['pk', 'Empat orang berfoto berjajar dalam satu baris. Banyak susunan yang mungkin adalah ...', ['4', '12', '24', '16'], 2, '4! = 24.'],
  ['pk', 'Banyak susunan huruf berbeda dari kata KAKI adalah ...', ['24', '12', '6', '8'], 1, '4!/2! = 12 (huruf K berulang 2 kali).'],
  ['pk', 'Dari 5 pria dan 4 wanita dipilih 3 orang: 2 pria dan 1 wanita. Banyak cara memilih adalah ...', ['20', '36', '40', '90'], 2, 'C(5,2) × C(4,1) = 10 × 4 = 40.'],

  // ----- Distribusi Diskrit -----
  ['diskrit', 'Mata dadu seimbang berdistribusi seragam diskrit 1–6. Nilai harapannya adalah ...', ['3', '3,5', '4', '6'], 1, 'E(X) = (n+1)/2 = 7/2 = 3,5.'],
  ['diskrit', 'Variabel Bernoulli dengan p = 0,8 memiliki varians ...', ['0,8', '0,2', '0,16', '0,64'], 2, 'Var = p(1−p) = 0,8 × 0,2 = 0,16.'],
  ['diskrit', 'Pada distribusi binomial dengan n = 5 dan p = 0,4, nilai rata-ratanya adalah ...', ['2', '1,2', '3', '0,4'], 0, 'E(X) = np = 5 × 0,4 = 2.'],
  ['diskrit', 'Pada binomial n = 3 dan p = 0,5, nilai P(X = 2) adalah ...', ['0,25', '0,375', '0,5', '0,125'], 1, 'C(3,2) × 0,5² × 0,5 = 3 × 0,125 = 0,375.'],
  ['diskrit', 'Pada distribusi geometrik dengan p = 0,25, rata-rata percobaan sampai sukses pertama adalah ...', ['2', '4', '0,25', '8'], 1, 'E(X) = 1/p = 1/0,25 = 4.'],
  ['diskrit', 'Binomial negatif dengan r = 2 dan p = 0,5 memiliki nilai harapan ...', ['1', '2', '4', '8'], 2, 'E(X) = r/p = 2/0,5 = 4.'],
  ['diskrit', 'Kotak berisi 10 bola (4 merah). Diambil 3 bola sekaligus. Peluang tepat 2 merah adalah ...', ['0,3', '0,4', '0,36', '0,6'], 0, 'C(4,2)·C(6,1)/C(10,3) = 36/120 = 0,3.'],
  ['diskrit', 'Pada distribusi Poisson dengan rata-rata λ = 2, varians distribusinya adalah ...', ['1', '2', '4', '√2'], 1, 'Pada Poisson, mean = varians = λ, jadi Var = 2.'],
  ['diskrit', 'Pada Poisson dengan λ = 3, peluang tidak ada kejadian, P(X = 0), adalah sekitar ...', ['0,050', '0,149', '0,368', '0,950'], 0, 'P(X=0) = e⁻³ ≈ 0,0498.'],
  ['diskrit', 'Pada Poisson dengan λ = 3, peluang P(X = 2) adalah sekitar ...', ['0,224', '0,149', '0,050', '0,448'], 0, 'e⁻³ × 3²/2! = 0,0498 × 4,5 ≈ 0,224.'],

  // ----- Distribusi Kontinu -----
  ['kontinu', 'Variabel X berdistribusi seragam kontinu pada [0, 10]. Nilai harapannya adalah ...', ['5', '10', '2,5', '0,5'], 0, 'E(X) = (a+b)/2 = 5.'],
  ['kontinu', 'Waktu tunggu bus berdistribusi seragam pada [0, 20] menit. Peluang menunggu kurang dari 5 menit adalah ...', ['0,2', '0,25', '0,5', '0,05'], 1, 'P = 5/20 = 0,25.'],
  ['kontinu', 'Distribusi eksponensial dengan λ = 0,5 memiliki rata-rata ...', ['0,5', '2', '1', '4'], 1, 'E(X) = 1/λ = 1/0,5 = 2.'],
  ['kontinu', 'Waktu antar kedatangan berdistribusi eksponensial dengan λ = 0,1 per menit. P(X > 20) adalah sekitar ...', ['0,135', '0,368', '0,865', '0,200'], 0, 'P(X > x) = e^(−λx) = e⁻² ≈ 0,135.'],
  ['kontinu', 'Pada distribusi normal, sekitar berapa persen data berada dalam μ ± 2σ?', ['68%', '95%', '99,7%', '50%'], 1, 'Aturan empiris: 68% – 95% – 99,7% untuk 1σ – 2σ – 3σ.'],
  ['kontinu', 'Nilai X = 75, μ = 60, dan σ = 5. Skor-z nilai tersebut adalah ...', ['3', '15', '2', '5'], 0, 'z = (75 − 60)/5 = 3.'],
  ['kontinu', 'Distribusi Gamma dengan α = 3 dan λ = 0,5 memiliki mean ...', ['1,5', '3', '6', '12'], 2, 'E(X) = α/λ = 3/0,5 = 6.'],
  ['kontinu', 'Variabel chi-kuadrat dengan derajat bebas k = 5 memiliki varians ...', ['5', '10', '25', '2,5'], 1, 'Var = 2k = 10.'],
  ['kontinu', 'Uji-t untuk sampel berukuran n = 16 memakai derajat bebas ...', ['16', '15', '14', '4'], 1, 'Derajat bebas = n − 1 = 15.'],
  ['kontinu', 'Dua sampel bervarians 25 dan 10. Statistik F = s₁²/s₂² bernilai ...', ['2,5', '0,4', '15', '35'], 0, 'F = 25/10 = 2,5.'],
];

// Ubah array menjadi objek agar mudah dipakai di app.js
const SOAL = RAW.map(([kat, tanya, opsi, benar, jelas]) => ({ kat, tanya, opsi, benar, jelas }));
