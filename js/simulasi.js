// js/simulasi.js
// Halaman simulasi: (1) koin/dadu, (2) binomial, (3) kalkulator distribusi, (4) kurva normal.

let grafik = {};                       // grafik aktif per id canvas (dihapus saat pindah halaman)
function bersihChart() { Object.values(grafik).forEach(c => c.destroy()); grafik = {}; }
function pasangChart(id, cfg) { if (grafik[id]) grafik[id].destroy(); grafik[id] = new Chart(id, cfg); }
const angka = (n, d = 4) => Number.isFinite(n) ? String(+n.toPrecision(d + 1)).replace('.', ',') : '-';
const nilai = id => Number(document.getElementById(id).value);

// ---------- fungsi matematika bantu ----------
const lnFak = n => { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; };
const lnKomb = (n, k) => lnFak(n) - lnFak(k) - lnFak(n - k);
function erf(x) {                      // pendekatan Abramowitz-Stegun
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
const cdfNormal = (x, mu, sd) => 0.5 * (1 + erf((x - mu) / (sd * Math.SQRT2)));
const pdfNormal = (x, mu, sd) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));

// ---------- definisi distribusi untuk kalkulator ----------
// diskrit: pmf(x) dan cdf dihitung dengan menjumlah pmf. kontinu: pdf dan cdf langsung.
const DIST = {
  binomial: { nama: 'Binomial', diskrit: true, par: [['n', 10], ['p', 0.5]],
    pmf: (x, { n, p }) => Number.isInteger(x) && x >= 0 && x <= n ? Math.exp(lnKomb(n, x) + x * Math.log(p) + (n - x) * Math.log(1 - p)) : 0,
    mean: ({ n, p }) => n * p, vari: ({ n, p }) => n * p * (1 - p), ok: ({ n, p }) => n >= 1 && p > 0 && p < 1 },
  poisson: { nama: 'Poisson', diskrit: true, par: [['lambda', 3]],
    pmf: (x, { lambda: l }) => Number.isInteger(x) && x >= 0 ? Math.exp(-l + x * Math.log(l) - lnFak(x)) : 0,
    mean: ({ lambda: l }) => l, vari: ({ lambda: l }) => l, ok: ({ lambda: l }) => l > 0 },
  geometrik: { nama: 'Geometrik', diskrit: true, par: [['p', 0.25]],
    pmf: (x, { p }) => Number.isInteger(x) && x >= 1 ? (1 - p) ** (x - 1) * p : 0,
    mean: ({ p }) => 1 / p, vari: ({ p }) => (1 - p) / (p * p), ok: ({ p }) => p > 0 && p < 1 },
  hipergeometrik: { nama: 'Hipergeometrik', diskrit: true, par: [['N', 10], ['K', 4], ['n', 3]],
    pmf: (x, { N, K, n }) => Number.isInteger(x) && x >= 0 && x <= Math.min(n, K) && n - x <= N - K ? Math.exp(lnKomb(K, x) + lnKomb(N - K, n - x) - lnKomb(N, n)) : 0,
    mean: ({ N, K, n }) => n * K / N, vari: ({ N, K, n }) => n * (K / N) * (1 - K / N) * (N - n) / (N - 1), ok: ({ N, K, n }) => N > 1 && K >= 0 && K <= N && n >= 1 && n <= N },
  seragam: { nama: 'Seragam Kontinu', diskrit: false, par: [['a', 0], ['b', 20]],
    pdf: (x, { a, b }) => x >= a && x <= b ? 1 / (b - a) : 0,
    cdf: (x, { a, b }) => x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a),
    mean: ({ a, b }) => (a + b) / 2, vari: ({ a, b }) => (b - a) ** 2 / 12, ok: ({ a, b }) => b > a },
  eksponensial: { nama: 'Eksponensial', diskrit: false, par: [['lambda', 0.1]],
    pdf: (x, { lambda: l }) => x >= 0 ? l * Math.exp(-l * x) : 0,
    cdf: (x, { lambda: l }) => x >= 0 ? 1 - Math.exp(-l * x) : 0,
    mean: ({ lambda: l }) => 1 / l, vari: ({ lambda: l }) => 1 / (l * l), ok: ({ lambda: l }) => l > 0 },
  normal: { nama: 'Normal', diskrit: false, par: [['mu', 60], ['sigma', 10]],
    pdf: (x, { mu, sigma }) => pdfNormal(x, mu, sigma),
    cdf: (x, { mu, sigma }) => cdfNormal(x, mu, sigma),
    mean: ({ mu }) => mu, vari: ({ sigma }) => sigma * sigma, ok: ({ sigma }) => sigma > 0 },
};

function simulasi() {
  bersihChart();
  document.getElementById('app').innerHTML = `
  <section class="page">
    <h1>Simulasi Peluang</h1>
    <p class="muted">Ubah parameter, lalu bandingkan peluang teoretis dengan hasil simulasi.</p>

    <div class="card">
      <h2>1. Simulasi Koin dan Dadu</h2>
      <div class="row">
        <label>Benda <select id="s1-jenis"><option value="koin">Koin</option><option value="dadu">Dadu</option></select></label>
        <label>Banyak lemparan <input id="s1-n" type="number" value="600" min="1" max="200000"></label>
        <button class="btn" id="s1-go">Jalankan</button>
      </div>
      <canvas id="s1-chart" height="110"></canvas><div id="s1-out" class="muted"></div>
    </div>

    <div class="card">
      <h2>2. Simulasi Distribusi Binomial</h2>
      <div class="row">
        <label>n (percobaan) <input id="s2-n" type="number" value="10" min="1" max="60"></label>
        <label>p (peluang sukses) <input id="s2-p" type="number" value="0.5" min="0.01" max="0.99" step="0.01"></label>
        <label>Banyak ulangan <input id="s2-t" type="number" value="2000" min="10" max="100000"></label>
        <button class="btn" id="s2-go">Jalankan</button>
      </div>
      <canvas id="s2-chart" height="110"></canvas><div id="s2-out" class="muted"></div>
    </div>

    <div class="card">
      <h2>3. Kalkulator Distribusi</h2>
      <div class="row"><label>Distribusi <select id="s3-d">${Object.entries(DIST).map(([k, v]) => `<option value="${k}">${v.nama}</option>`).join('')}</select></label></div>
      <div class="row" id="s3-par"></div>
      <div class="row"><label>Nilai x <input id="s3-x" type="number" step="any" value="2"></label><button class="btn" id="s3-go">Hitung</button></div>
      <div id="s3-out" class="hasil"></div>
    </div>

    <div class="card">
      <h2>4. Kurva Distribusi Normal</h2>
      <div class="row">
        <label>Mean (μ) <input id="s4-mu" type="number" step="any" value="60"></label>
        <label>Std. deviasi (σ) <input id="s4-sd" type="number" step="any" value="10" min="0.1"></label>
        <label>Dari (a) <input id="s4-a" type="number" step="any" value="50"></label>
        <label>Sampai (b) <input id="s4-b" type="number" step="any" value="70"></label>
      </div>
      <canvas id="s4-chart" height="110"></canvas><div id="s4-out" class="muted"></div>
    </div>
  </section>`;

  // ---- 1. koin / dadu ----
  document.getElementById('s1-go').onclick = () => {
    const k = document.getElementById('s1-jenis').value === 'koin' ? 2 : 6;
    const label = k === 2 ? ['Angka', 'Gambar'] : ['1', '2', '3', '4', '5', '6'];
    const n = Math.min(200000, Math.max(1, nilai('s1-n')));
    const hit = Array(k).fill(0);
    for (let i = 0; i < n; i++) hit[Math.floor(Math.random() * k)]++;
    pasangChart('s1-chart', { type: 'bar',
      data: { labels: label, datasets: [
        { label: 'Teoretis (%)', data: label.map(() => 100 / k), backgroundColor: '#93c5fd' },
        { label: 'Simulasi (%)', data: hit.map(h => h / n * 100), backgroundColor: '#7c3aed' }] },
      options: { scales: { y: { beginAtZero: true, title: { display: true, text: 'Persen' } } } } });
    document.getElementById('s1-out').textContent = 'Frekuensi hasil: ' + label.map((l, i) => `${l} = ${hit[i]}`).join(', ') + `  (dari ${n} lemparan)`;
  };

  // ---- 2. binomial ----
  document.getElementById('s2-go').onclick = () => {
    const n = Math.round(nilai('s2-n')), p = nilai('s2-p'), T = Math.round(nilai('s2-t'));
    if (!(n >= 1 && p > 0 && p < 1 && T >= 1)) return alert('Periksa nilai n, p, dan banyak ulangan.');
    const hit = Array(n + 1).fill(0);
    for (let t = 0; t < T; t++) { let x = 0; for (let i = 0; i < n; i++) if (Math.random() < p) x++; hit[x]++; }
    const xs = [...Array(n + 1).keys()];
    pasangChart('s2-chart', { type: 'bar',
      data: { labels: xs, datasets: [
        { label: 'Teoretis P(X=x) (%)', data: xs.map(x => DIST.binomial.pmf(x, { n, p }) * 100), backgroundColor: '#93c5fd' },
        { label: 'Simulasi (%)', data: hit.map(h => h / T * 100), backgroundColor: '#7c3aed' }] },
      options: { scales: { x: { title: { display: true, text: 'Banyak sukses (x)' } }, y: { beginAtZero: true } } } });
    const rata = hit.reduce((s, h, x) => s + h * x, 0) / T;
    document.getElementById('s2-out').textContent = `Rata-rata simulasi = ${angka(rata, 3)} | Teoretis np = ${angka(n * p, 3)}`;
  };

  // ---- 3. kalkulator ----
  function isiParameter() {
    const d = DIST[document.getElementById('s3-d').value];
    document.getElementById('s3-par').innerHTML = d.par.map(([nm, v]) => `<label>${nm} <input id="par-${nm}" type="number" step="any" value="${v}"></label>`).join('');
  }
  document.getElementById('s3-d').onchange = isiParameter; isiParameter();
  document.getElementById('s3-go').onclick = () => {
    const d = DIST[document.getElementById('s3-d').value];
    const par = {}; d.par.forEach(([nm]) => par[nm] = nilai('par-' + nm));
    const x = nilai('s3-x'), out = document.getElementById('s3-out');
    if (!d.ok(par)) { out.innerHTML = '<span class="salah">Parameter tidak valid untuk distribusi ini.</span>'; return; }
    let baris;
    if (d.diskrit) {
      const cdf = v => { let s = 0; for (let i = 0; i <= Math.floor(v) && i < 100000; i++) s += d.pmf(i, par); return s; };
      baris = [['P(X = x)', d.pmf(x, par)], ['P(X ≤ x)', cdf(x)], ['P(X ≥ x)', 1 - cdf(x - 1)]];
    } else {
      baris = [['f(x) (kepadatan)', d.pdf(x, par)], ['P(X ≤ x)', d.cdf(x, par)], ['P(X > x)', 1 - d.cdf(x, par)]];
    }
    baris.push(['Mean E(X)', d.mean(par)], ['Varians Var(X)', d.vari(par)]);
    out.innerHTML = '<table>' + baris.map(([a, b]) => `<tr><td>${a}</td><td><b>${angka(b)}</b></td></tr>`).join('') + '</table>';
  };

  // ---- 4. kurva normal ----
  function gambarNormal() {
    const mu = nilai('s4-mu'), sd = nilai('s4-sd'), a = nilai('s4-a'), b = nilai('s4-b');
    if (!(sd > 0)) return;
    const xs = [], f = [], area = [];
    for (let i = 0; i <= 160; i++) { const x = mu - 4 * sd + i * (8 * sd / 160); xs.push(+x.toFixed(2)); f.push(pdfNormal(x, mu, sd)); area.push(x >= a && x <= b ? pdfNormal(x, mu, sd) : null); }
    pasangChart('s4-chart', { type: 'line',
      data: { labels: xs, datasets: [
        { label: 'Kurva normal', data: f, borderColor: '#1e3a8a', pointRadius: 0, tension: 0.3 },
        { label: 'Daerah a–b', data: area, borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,.35)', fill: 'origin', pointRadius: 0, spanGaps: false }] },
      options: { animation: false, scales: { x: { ticks: { maxTicksLimit: 9 } } } } });
    document.getElementById('s4-out').textContent = `P(${a} < X < ${b}) = ${angka(cdfNormal(b, mu, sd) - cdfNormal(a, mu, sd))}`;
  }
  ['s4-mu', 's4-sd', 's4-a', 's4-b'].forEach(id => document.getElementById(id).oninput = gambarNormal);

  // Tampilkan hasil awal agar halaman tidak kosong
  document.getElementById('s1-go').click();
  document.getElementById('s2-go').click();
  document.getElementById('s3-go').click();
  gambarNormal();
}
