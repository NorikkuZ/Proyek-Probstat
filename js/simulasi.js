// js/simulasi.js
// Halaman simulasi: (1) koin/dadu, (2) binomial, (3) kalkulator distribusi, (4) kurva normal.

let grafik = {};
function bersihChart() {
  Object.values(grafik).forEach(c => { if (c && typeof c.destroy === 'function') c.destroy(); });
  grafik = {};
}

function pasangChart(id, cfg) {
  const el = document.getElementById(id);
  if (!el) return;
  const box = el.parentElement;
  if (typeof Chart === 'undefined') {
    if (box) box.innerHTML = '<p class="chart-empty">Grafik tidak dapat ditampilkan karena Chart.js gagal dimuat.</p>';
    return;
  }
  if (grafik[id]) grafik[id].destroy();
  Chart.defaults.font.family = '"Lexend", sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#231924';
  const opts = Object.assign({}, cfg.options || {}, {
    responsive: true,
    maintainAspectRatio: false,
    plugins: Object.assign({
      legend: { labels: { boxWidth: 14, padding: 12 } },
    }, (cfg.options && cfg.options.plugins) || {}),
  });
  grafik[id] = new Chart(el, Object.assign({}, cfg, { options: opts }));
}

const angka = (n, d = 4) => Number.isFinite(n) ? String(+n.toPrecision(d + 1)).replace('.', ',') : '-';
const nilai = id => Number(document.getElementById(id).value);
const pesanSalah = teks => `<span class="salah">[!] ${teks}</span>`;

// ---------- fungsi matematika bantu ----------
const lnFak = n => { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; };
const lnKomb = (n, k) => lnFak(n) - lnFak(k) - lnFak(n - k);
function erf(x) {
  // Pendekatan numerik Abramowitz-Stegun (7.1.26)
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
const cdfNormal = (x, mu, sd) => 0.5 * (1 + erf((x - mu) / (sd * Math.SQRT2)));
const pdfNormal = (x, mu, sd) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));

// ---------- definisi distribusi untuk kalkulator ----------
// Diskrit: pmf(x) dan cdf menjumlah pmf. Kontinu: pdf dan cdf langsung.
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
  const bar = typeof winBar === 'function' ? winBar : (j, t) => `<div class="win-bar ${t}"><span class="win-title">${j}</span><span class="win-ctrl" aria-hidden="true"><span>_</span><span>□</span><span>X</span></span></div>`;
  const ikonLab = typeof svgBungaTanya !== 'undefined' ? svgBungaTanya : '';
  document.getElementById('app').innerHTML = `
  <section class="page sim-page">
    <div class="section-banner">
      ${ikonLab}
      <div>
        <h1>Simulasi Peluang</h1>
        <p class="muted">Ubah parameter pada panel kontrol, lalu bandingkan peluang teoretis dengan hasil simulasi.</p>
      </div>
    </div>

    <div class="sim-nav" role="navigation" aria-label="Pintasan Modul Simulasi">
      <button type="button" class="btn alt sim-jump" data-scroll="sim-win-1">1. Koin &amp; Dadu</button>
      <button type="button" class="btn alt sim-jump" data-scroll="sim-win-2">2. Binomial</button>
      <button type="button" class="btn alt sim-jump" data-scroll="sim-win-3">3. Kalkulator</button>
      <button type="button" class="btn alt sim-jump" data-scroll="sim-win-4">4. Kurva Normal</button>
    </div>

    <div class="card" id="sim-win-1">
      ${bar('SIM_01_COIN_DICE.EXE', 'bar-yellow')}
      <div class="win-body sim-body">
        <div class="sim-head">
          <h2>1. Simulasi Koin dan Dadu</h2>
          <p class="sim-sub">Uji frekuensi kemunculan hasil terhadap peluang teoretis yang seragam.</p>
        </div>
        <div class="sim-split">
          <div class="sim-panel">
            <div class="sim-fields">
              <label for="s1-jenis">Benda
                <select id="s1-jenis"><option value="koin">Koin (2 sisi)</option><option value="dadu">Dadu (6 sisi)</option></select>
              </label>
              <label for="s1-n">Banyak lemparan
                <input id="s1-n" type="number" value="600" min="1" max="200000">
              </label>
            </div>
            <button type="button" class="btn sim-run" id="s1-go">Jalankan</button>
            <div id="s1-out" class="status-out" role="status" aria-live="polite"></div>
          </div>
          <div class="sim-stage">
            <div class="chart-box"><canvas id="s1-chart"></canvas></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" id="sim-win-2">
      ${bar('SIM_02_BINOMIAL.EXE', 'bar-pink')}
      <div class="win-body sim-body">
        <div class="sim-head">
          <h2>2. Simulasi Distribusi Binomial</h2>
          <p class="sim-sub">Bandingkan sebaran banyak sukses dari percobaan berulang terhadap rumus binomial.</p>
        </div>
        <div class="sim-split">
          <div class="sim-panel">
            <div class="sim-fields two-col">
              <label for="s2-n">n (percobaan)
                <input id="s2-n" type="number" value="10" min="1" max="60">
              </label>
              <label for="s2-p">p (sukses)
                <input id="s2-p" type="number" value="0.5" min="0.01" max="0.99" step="0.01">
              </label>
              <label class="field-full" for="s2-t">Banyak ulangan
                <input id="s2-t" type="number" value="2000" min="10" max="100000">
              </label>
            </div>
            <button type="button" class="btn sim-run" id="s2-go">Jalankan</button>
            <div id="s2-out" class="status-out" role="status" aria-live="polite"></div>
          </div>
          <div class="sim-stage">
            <div class="chart-box"><canvas id="s2-chart"></canvas></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" id="sim-win-3">
      ${bar('SIM_03_CALC_DIST.EXE', 'bar-mint')}
      <div class="win-body sim-body">
        <div class="sim-head">
          <h2>3. Kalkulator Distribusi</h2>
          <p class="sim-sub">Hitung nilai peluang, kumulatif, mean, dan varians untuk tujuh distribusi utama.</p>
        </div>
        <div class="sim-split calc-split">
          <div class="sim-panel">
            <div class="sim-fields">
              <label for="s3-d">Distribusi
                <select id="s3-d">${Object.entries(DIST).map(([k, v]) => `<option value="${k}">${v.nama}</option>`).join('')}</select>
              </label>
            </div>
            <div class="sim-fields two-col" id="s3-par"></div>
            <div class="sim-fields">
              <label for="s3-x">Nilai x
                <input id="s3-x" type="number" step="any" value="2">
              </label>
            </div>
            <button type="button" class="btn sim-run" id="s3-go">Hitung</button>
          </div>
          <div class="sim-stage">
            <div id="s3-out" class="hasil" role="status" aria-live="polite"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" id="sim-win-4">
      ${bar('SIM_04_NORMAL_CURVE.EXE', 'bar-blue')}
      <div class="win-body sim-body">
        <div class="sim-head">
          <h2>4. Kurva Distribusi Normal</h2>
          <p class="sim-sub">Visualisasikan luas daerah peluang antara batas bawah a dan batas atas b.</p>
        </div>
        <div class="sim-split">
          <div class="sim-panel">
            <div class="sim-fields two-col">
              <label for="s4-mu">Mean (&mu;)
                <input id="s4-mu" type="number" step="any" value="60">
              </label>
              <label for="s4-sd">Std. deviasi (&sigma;)
                <input id="s4-sd" type="number" step="any" value="10" min="0.1">
              </label>
              <label for="s4-a">Dari (a)
                <input id="s4-a" type="number" step="any" value="50">
              </label>
              <label for="s4-b">Sampai (b)
                <input id="s4-b" type="number" step="any" value="70">
              </label>
            </div>
            <button type="button" class="btn sim-run" id="s4-go">Hitung</button>
            <div id="s4-out" class="status-out" role="status" aria-live="polite"></div>
          </div>
          <div class="sim-stage">
            <div class="chart-box"><canvas id="s4-chart"></canvas></div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

  // Pintasan gulir cepat antar modul simulasi
  const kurangiGerak = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.sim-jump').forEach(btn => {
    btn.onclick = () => {
      const target = document.getElementById(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: kurangiGerak ? 'auto' : 'smooth', block: 'start' });
    };
  });

  // ---- 1. koin / dadu ----
  document.getElementById('s1-go').onclick = () => {
    const out = document.getElementById('s1-out');
    const nRaw = nilai('s1-n');
    if (!Number.isFinite(nRaw) || nRaw < 1) {
      out.innerHTML = pesanSalah('Banyak lemparan minimal 1.');
      return;
    }
    const k = document.getElementById('s1-jenis').value === 'koin' ? 2 : 6;
    const label = k === 2 ? ['Angka', 'Gambar'] : ['1', '2', '3', '4', '5', '6'];
    const n = Math.min(200000, Math.round(nRaw));
    const hit = Array(k).fill(0);
    for (let i = 0; i < n; i++) hit[Math.floor(Math.random() * k)]++;
    pasangChart('s1-chart', {
      type: 'bar',
      data: {
        labels: label,
        datasets: [
          { label: 'Teoretis (%)', data: label.map(() => 100 / k), backgroundColor: '#5ce1e6', borderColor: '#231924', borderWidth: 2 },
          { label: 'Simulasi (%)', data: hit.map(h => h / n * 100), backgroundColor: '#ff70a6', borderColor: '#231924', borderWidth: 2 },
        ],
      },
      options: { scales: { y: { beginAtZero: true, title: { display: true, text: 'Persen (%)' } } } },
    });
    out.textContent = 'Hasil: ' + label.map((l, i) => `${l} = ${hit[i]}`).join(', ') + ` (total ${n} lemparan)`;
  };
  document.getElementById('s1-jenis').onchange = () => document.getElementById('s1-go').click();

  // ---- 2. binomial ----
  document.getElementById('s2-go').onclick = () => {
    const out = document.getElementById('s2-out');
    const n = Math.round(nilai('s2-n')), p = nilai('s2-p'), T = Math.round(nilai('s2-t'));
    if (!(Number.isFinite(n) && n >= 1 && n <= 60 && Number.isFinite(p) && p > 0 && p < 1 && Number.isFinite(T) && T >= 1 && T <= 100000)) {
      out.innerHTML = pesanSalah('Gunakan 1 <= n <= 60, 0 < p < 1, dan ulangan 1 sampai 100000.');
      return;
    }
    const hit = Array(n + 1).fill(0);
    for (let t = 0; t < T; t++) {
      let x = 0;
      for (let i = 0; i < n; i++) if (Math.random() < p) x++;
      hit[x]++;
    }
    const xs = [...Array(n + 1).keys()];
    pasangChart('s2-chart', {
      type: 'bar',
      data: {
        labels: xs,
        datasets: [
          { label: 'Teoretis P(X=x) (%)', data: xs.map(x => DIST.binomial.pmf(x, { n, p }) * 100), backgroundColor: '#ffca3a', borderColor: '#231924', borderWidth: 2 },
          { label: 'Simulasi (%)', data: hit.map(h => h / T * 100), backgroundColor: '#b5179e', borderColor: '#231924', borderWidth: 2 },
        ],
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Banyak sukses (x)' }, ticks: { autoSkip: true, maxTicksLimit: 13 } },
          y: { beginAtZero: true, title: { display: true, text: 'Persen (%)' } },
        },
      },
    });
    const rata = hit.reduce((s, h, x) => s + h * x, 0) / T;
    out.textContent = `Rata-rata simulasi = ${angka(rata, 3)} | Teoretis np = ${angka(n * p, 3)}`;
  };

  // ---- 3. kalkulator ----
  function hitungDist() {
    const d = DIST[document.getElementById('s3-d').value];
    const par = {};
    let semuaValid = true;
    d.par.forEach(([nm]) => {
      const v = nilai('par-' + nm);
      if (!Number.isFinite(v)) semuaValid = false;
      par[nm] = v;
    });
    const x = nilai('s3-x'), out = document.getElementById('s3-out');
    if (!semuaValid || !Number.isFinite(x) || !d.ok(par)) {
      out.innerHTML = pesanSalah('Parameter atau nilai x tidak valid untuk distribusi ini.');
      return;
    }
    let baris;
    if (d.diskrit) {
      const cdf = v => { let s = 0; for (let i = 0; i <= Math.floor(v) && i < 100000; i++) s += d.pmf(i, par); return s; };
      baris = [['P(X = x)', d.pmf(x, par)], ['P(X <= x)', cdf(x)], ['P(X >= x)', 1 - cdf(x - 1)]];
    } else {
      baris = [['f(x) (kepadatan)', d.pdf(x, par)], ['P(X <= x)', d.cdf(x, par)], ['P(X > x)', 1 - d.cdf(x, par)]];
    }
    baris.push(['Mean E(X)', d.mean(par)], ['Varians Var(X)', d.vari(par)]);
    out.innerHTML = '<table>' + baris.map(([a, b]) => `<tr><td>${a}</td><td><b>${angka(b)}</b></td></tr>`).join('') + '</table>';
  }

  function isiParameter() {
    const d = DIST[document.getElementById('s3-d').value];
    const kelasSingle = d.par.length === 1 ? ' class="field-full"' : '';
    document.getElementById('s3-par').innerHTML = d.par.map(([nm, v]) =>
      `<label${kelasSingle} for="par-${nm}">${nm} <input id="par-${nm}" type="number" step="any" value="${v}"></label>`
    ).join('');
    hitungDist();
  }
  document.getElementById('s3-go').onclick = hitungDist;
  document.getElementById('s3-d').onchange = isiParameter;
  isiParameter();

  // ---- 4. kurva normal ----
  function gambarNormal() {
    const out = document.getElementById('s4-out');
    const mu = nilai('s4-mu'), sd = nilai('s4-sd'), a = nilai('s4-a'), b = nilai('s4-b');
    if (![mu, sd, a, b].every(Number.isFinite) || !(sd > 0)) {
      out.innerHTML = pesanSalah('Pastikan seluruh nilai valid dan std. deviasi > 0.');
      return;
    }
    if (a > b) {
      out.innerHTML = pesanSalah('Batas Dari (a) harus <= batas Sampai (b).');
      return;
    }
    const xs = [], f = [], area = [];
    for (let i = 0; i <= 160; i++) {
      const x = mu - 4 * sd + i * (8 * sd / 160);
      xs.push(+x.toFixed(2));
      f.push(pdfNormal(x, mu, sd));
      area.push(x >= a && x <= b ? pdfNormal(x, mu, sd) : null);
    }
    pasangChart('s4-chart', {
      type: 'line',
      data: {
        labels: xs,
        datasets: [
          { label: 'Kurva normal', data: f, borderColor: '#231924', borderWidth: 2, pointRadius: 0, tension: 0.2 },
          { label: 'Daerah a sampai b', data: area, borderColor: '#ff2a85', backgroundColor: 'rgba(255, 112, 166, 0.5)', fill: 'origin', pointRadius: 0, spanGaps: false },
        ],
      },
      options: { animation: false, scales: { x: { ticks: { maxTicksLimit: 9 } }, y: { beginAtZero: true } } },
    });
    out.textContent = `P(${a} < X < ${b}) = ${angka(cdfNormal(b, mu, sd) - cdfNormal(a, mu, sd))}`;
  }
  document.getElementById('s4-go').onclick = gambarNormal;
  ['s4-mu', 's4-sd', 's4-a', 's4-b'].forEach(id => document.getElementById(id).oninput = gambarNormal);

  // Tampilkan hasil awal agar semua modul langsung berisi data
  document.getElementById('s1-go').click();
  document.getElementById('s2-go').click();
  document.getElementById('s3-go').click();
  gambarNormal();
}
