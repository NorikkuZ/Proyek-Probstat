// js/app.js
// Logika utama: navigasi (router berbasis #hash), halaman beranda, materi, dan latihan soal.

const app = document.getElementById('app');
let timer = null;                                  // interval timer kuis

// ---------- utilitas ----------
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const acak = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const katNama = id => (KATEGORI.find(k => k.id === id) || {}).nama || id;
const winBar = (judul, tema = 'bar-pink') => `<div class="win-bar ${tema}"><span class="win-title">${judul}</span><span class="win-ctrl" aria-hidden="true"><span>_</span><span>□</span><span>X</span></span></div>`;
const temaBar = ['bar-yellow', 'bar-pink', 'bar-blue', 'bar-mint'];

// Maskot SVG Pixel Art (Mr. Computer, Bunga Piksel ? beroutline gelap tegas, Bebek Pixel)
const svgMrComputer = `<svg class="mascot-svg px-bounce" viewBox="0 0 32 32" width="110" height="110" shape-rendering="crispEdges" aria-hidden="true">
  <rect x="10" y="2" width="12" height="4" fill="#4a3f59"/>
  <rect x="7" y="6" width="18" height="2" fill="#231924"/>
  <rect x="5" y="8" width="22" height="15" fill="#231924"/>
  <rect x="6" y="9" width="20" height="13" fill="#4cc9f0"/>
  <rect x="8" y="11" width="16" height="9" fill="#ffea6c"/>
  <rect class="eye-blink" x="11" y="13" width="2" height="3" fill="#231924"/>
  <rect class="eye-blink" x="19" y="13" width="2" height="3" fill="#231924"/>
  <rect x="10" y="16" width="2" height="1" fill="#ff70a6"/>
  <rect x="20" y="16" width="2" height="1" fill="#ff70a6"/>
  <rect x="12" y="17" width="1" height="1" fill="#231924"/>
  <rect x="13" y="18" width="6" height="1" fill="#231924"/>
  <rect x="19" y="17" width="1" height="1" fill="#231924"/>
  <rect x="8" y="23" width="16" height="2" fill="#3a86ff"/>
  <rect x="4" y="25" width="24" height="3" fill="#231924"/>
  <rect x="5" y="26" width="22" height="1" fill="#72efdd"/>
</svg>`;

const svgBungaTanya = `<svg class="flower-svg px-wiggle" viewBox="0 0 24 28" width="54" height="62" shape-rendering="crispEdges" aria-hidden="true">
  <rect x="10" y="1" width="5" height="2" fill="#231924"/>
  <rect x="14" y="3" width="2" height="2" fill="#231924"/>
  <rect x="11" y="5" width="3" height="2" fill="#231924"/>
  <rect x="11" y="8" width="2" height="2" fill="#231924"/>
  <rect x="8" y="10" width="8" height="16" fill="#231924"/>
  <rect x="4" y="13" width="16" height="10" fill="#231924"/>
  <rect x="6" y="11" width="12" height="14" fill="#231924"/>
  <rect x="9" y="11" width="6" height="14" fill="#ffffff"/>
  <rect x="5" y="14" width="14" height="8" fill="#ffffff"/>
  <rect x="7" y="12" width="10" height="12" fill="#ffffff"/>
  <rect x="8" y="14" width="8" height="8" fill="#ffca3a"/>
  <rect class="eye-blink" x="10" y="16" width="1" height="2" fill="#231924"/>
  <rect class="eye-blink" x="13" y="16" width="1" height="2" fill="#231924"/>
  <rect x="10" y="19" width="4" height="1" fill="#231924"/>
</svg>`;

const svgBebekKuis = `<svg class="duck-svg px-bounce" viewBox="0 0 24 24" width="52" height="52" shape-rendering="crispEdges" aria-hidden="true">
  <rect x="2" y="2" width="20" height="20" fill="#231924"/>
  <rect x="3" y="3" width="18" height="18" fill="#9b5de5"/>
  <rect x="9" y="4" width="2" height="3" fill="#8ac926"/>
  <rect x="11" y="5" width="2" height="3" fill="#52b788"/>
  <rect x="7" y="6" width="2" height="2" fill="#8ac926"/>
  <rect x="7" y="8" width="8" height="7" fill="#ffea00"/>
  <rect class="eye-blink" x="11" y="10" width="2" height="2" fill="#231924"/>
  <rect x="14" y="11" width="5" height="3" fill="#ff7b00"/>
  <rect x="5" y="15" width="12" height="5" fill="#ffca3a"/>
</svg>`;

// Ubah teks biasa menjadi HTML: paragraf dipisah baris kosong, baris berawalan "- " jadi daftar.
function fmt(t) {
  return t.split(/\n\n+/).map(b => {
    const baris = b.split('\n');
    if (baris.every(l => l.startsWith('- '))) return '<ul>' + baris.map(l => '<li>' + esc(l.slice(2)) + '</li>').join('') + '</ul>';
    if (baris.some(l => l.startsWith('- '))) {
      const awal = baris.filter(l => !l.startsWith('- ')).map(esc).join('<br>');
      return (awal ? '<p>' + awal + '</p>' : '') + '<ul>' + baris.filter(l => l.startsWith('- ')).map(l => '<li>' + esc(l.slice(2)) + '</li>').join('') + '</ul>';
    }
    return '<p>' + baris.map(esc).join('<br>') + '</p>';
  }).join('');
}
// Render rumus KaTeX pada elemen (tanda $...$ inline, $$...$$ tampil terpisah)
function rumus(el) {
  if (window.renderMathInElement) renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false });
}

// Jam digital di Taskbar bawah
function updateJamOS() {
  const el = document.getElementById('os-clock');
  if (!el) return;
  const d = new Date();
  el.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}
setInterval(updateJamOS, 10000);
updateJamOS();

// ---------- router ----------
function route() {
  clearInterval(timer); Q = null;
  if (typeof bersihChart === 'function') bersihChart();
  const [, page = '', arg] = location.hash.split('/');
  document.querySelectorAll('#menu a, .nav-shortcut, .task-tab').forEach(a => a.classList.toggle('aktif', a.dataset.p === page));
  ({ '': beranda, materi: materi, simulasi: simulasi, latihan: latihan }[page] || beranda)(arg);
  rumus(app);
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
window.addEventListener('load', () => { updateJamOS(); rumus(app); });
document.querySelectorAll('.nav a, .nav-shortcut, .task-tab').forEach(a => a.addEventListener('click', () => {
  if (location.hash === a.getAttribute('href')) route();
}));

// ---------- BERANDA ----------
function beranda() {
  app.innerHTML = `
  <section class="hero">
    ${winBar('MR_COMPUTER_WELCOME.EXE', 'bar-yellow')}
    <div class="win-body hero-grid">
      <div class="hero-copy">
        <div class="speech-bubble">Halo teman-teman! Yuk belajar sambil bermain di dunia <b>StatPeluang.OS</b>!</div>
        <h1>Catatan & Simulasi Probabilitas dan Statistika</h1>
        <p>Kumpulan ringkasan materi dari peluang dasar hingga distribusi kontinu, dilengkapi simulasi interaktif untuk menguji parameter secara langsung serta latihan soal mandiri.</p>
        <div class="hero-actions">
          <a class="btn" href="#/materi">Mulai Belajar</a> <a class="btn alt" href="#/latihan">Latihan Soal</a>
        </div>
      </div>
      <div class="hero-stage" aria-hidden="true">
        <div class="vapor-screen">
          <div class="vapor-sun"></div>
          <div class="vapor-mt"></div>
          <div class="vapor-grid"></div>
          <div class="mascot-wrap">${svgMrComputer}</div>
        </div>
        <div class="player-controls">
          <span>&lt;&lt;</span><span>PLAY</span><span>||</span><span>&gt;&gt;</span>
        </div>
      </div>
    </div>
  </section>
  <section class="stats">
    <div>${winBar('MODUL_BELAJAR.DAT', 'bar-pink')}<div class="win-body"><b>${MATERI.length}</b><span>Materi</span></div></div>
    <div>${winBar('BANK_KUIS.DAT', 'bar-mint')}<div class="win-body"><b>${SOAL.length}</b><span>Latihan Soal</span></div></div>
    <div>${winBar('FOLDER_TOPIK.SYS', 'bar-blue')}<div class="win-body"><b>${KATEGORI.length}</b><span>Kategori</span></div></div>
  </section>
  <div class="section-banner">
    ${svgBungaTanya}
    <div>
      <h2 class="judul-bagian">Kategori Pembelajaran</h2>
      <p class="banner-sub">Klik salah satu folder program di bawah untuk membuka petualangan materi!</p>
    </div>
  </div>
  <section class="grid">
    ${KATEGORI.map((k, idx) => {
      const pertama = MATERI.find(m => m.kat === k.id);
      return `<a class="card kat" href="#/materi/${pertama.id}">${winBar(`FOLDER_0${idx + 1}.DIR`, temaBar[idx % 4])}<div class="win-body"><div class="ikon">${k.ikon}</div><h3>${k.nama}</h3><p>${k.desk}</p><small>${MATERI.filter(m => m.kat === k.id).length} materi · ${SOAL.filter(s => s.kat === k.id).length} soal</small></div></a>`;
    }).join('')}
  </section>`;
}

// ---------- MATERI ----------
function materi(id) {
  const idx = Math.max(0, MATERI.findIndex(m => m.id === id));
  const m = MATERI[idx];
  const sisi = KATEGORI.map(k => `<h4>${k.ikon} <span>${k.nama}</span></h4>` +
    MATERI.filter(x => x.kat === k.id).map(x => `<a href="#/materi/${x.id}" class="${x.id === m.id ? 'aktif' : ''}">${x.judul}</a>`).join('')).join('');
  const prev = MATERI[idx - 1], next = MATERI[idx + 1];
  app.innerHTML = `
  <section class="materi-wrap">
    <aside class="sidebar">
      ${winBar('FOLDER_MATERI.DIR', 'bar-blue')}
      <div class="win-body">${sisi}</div>
    </aside>
    <article class="card isi">
      ${winBar(`BUKU_PINTAR.DOC - ${m.id.toUpperCase()}`, 'bar-yellow')}
      <div class="win-body">
        <span class="badge">${katNama(m.kat)}</span>
        <h1>${m.judul}</h1>
        <h3>Penjelasan</h3>${fmt(m.isi)}
        <h3>Rumus Utama</h3>${m.rumus.map(r => `<div class="rumus">$$${esc(r)}$$</div>`).join('')}
        <h3>Contoh Soal</h3>${fmt(m.contoh)}
        <details><summary>Lihat pembahasan langkah demi langkah</summary>${fmt(m.bahas)}</details>
        <div class="pager">
          ${prev ? `<a class="btn alt" href="#/materi/${prev.id}">&lt;- ${prev.judul}</a>` : '<span></span>'}
          ${next ? `<a class="btn" href="#/materi/${next.id}">${next.judul} -&gt;</a>` : `<a class="btn" href="#/latihan">Kerjakan Latihan -&gt;</a>`}
        </div>
      </div>
    </article>
  </section>`;
  // rumus di dalam <details> yang tertutup tetap dirender oleh route() -> rumus(app)
}

// ---------- LATIHAN SOAL ----------
let Q = null;                                      // state kuis yang sedang berjalan

function latihan() {
  clearInterval(timer); Q = null;
  const ikonGabungan = '<svg class="px-bounce" viewBox="0 0 16 16" width="26" height="26" shape-rendering="crispEdges"><rect x="3" y="1" width="10" height="3" fill="#231924"/><rect x="4" y="2" width="8" height="6" fill="#ffea00"/><rect x="2" y="3" width="2" height="4" fill="#ffbe0b"/><rect x="12" y="3" width="2" height="4" fill="#ffbe0b"/><rect x="6" y="8" width="4" height="3" fill="#ff9f1c"/><rect x="4" y="11" width="8" height="3" fill="#b5179e"/><rect x="7" y="4" width="2" height="2" fill="#ffffff"/></svg>';
  app.innerHTML = `
  <section class="page">
    <div class="section-banner">
      ${svgBebekKuis}
      <div>
        <h1>Latihan Soal</h1>
        <p class="muted">Pilih kategori. Soal dan urutan pilihan jawaban diacak setiap kali kuis dimulai. Jawaban dan pembahasan ditampilkan setelah kamu menekan Submit.</p>
      </div>
    </div>
    <div class="grid">
      ${KATEGORI.map((k, idx) => `<button type="button" class="card kat tombol" data-k="${k.id}">${winBar(`GAME_KUIS_0${idx + 1}.EXE`, temaBar[idx % 4])}<div class="win-body"><div class="ikon">${k.ikon}</div><h3>${k.nama}</h3><small>${SOAL.filter(s => s.kat === k.id).length} soal</small></div></button>`).join('')}
      <button type="button" class="card kat tombol gabungan" data-k="gabungan">${winBar('SUPER_MIX_QUIZ.EXE', 'bar-pink')}<div class="win-body"><div class="ikon">${ikonGabungan}</div><h3>Kuis Gabungan</h3><small>15 soal acak dari semua materi</small></div></button>
    </div>
  </section>`;
  app.querySelectorAll('[data-k]').forEach(b => b.onclick = () => mulai(b.dataset.k));
}

function mulai(kat) {
  let pool = acak(kat === 'gabungan' ? SOAL : SOAL.filter(s => s.kat === kat));
  if (kat === 'gabungan') pool = pool.slice(0, 15);
  Q = { kat, i: 0, t0: Date.now(), ans: pool.map(() => null),
        list: pool.map(s => ({ tanya: s.tanya, jelas: s.jelas, opts: acak(s.opsi.map((t, i) => ({ t, ok: i === s.benar }))) })) };
  clearInterval(timer);
  timer = setInterval(() => { const el = document.getElementById('timer'); if (el) el.textContent = waktu((Date.now() - Q.t0) / 1000); }, 1000);
  tampilSoal();
}
const waktu = d => { d = Math.round(d); return String(Math.floor(d / 60)).padStart(2, '0') + ':' + String(d % 60).padStart(2, '0'); };

function tampilSoal() {
  const s = Q.list[Q.i], huruf = 'ABCD';
  const judul = Q.kat === 'gabungan' ? 'Kuis Gabungan' : katNama(Q.kat);
  app.innerHTML = `
  <section class="page kuis">
    <div class="kuis-head"><h2>${judul}</h2><div class="timer">TIME: <span id="timer">${waktu((Date.now() - Q.t0) / 1000)}</span></div></div>
    <div class="nomor">${Q.list.map((_, n) => `<button type="button" class="${n === Q.i ? 'now' : ''} ${Q.ans[n] !== null ? 'jwb' : ''}" data-n="${n}">${n + 1}</button>`).join('')}</div>
    <div class="card">
      ${winBar(`STAGE_${String(Q.i + 1).padStart(2, '0')}.QIZ`, 'bar-pink')}
      <div class="win-body">
        <p class="tanya"><b>Soal ${Q.i + 1} dari ${Q.list.length}</b><br>${esc(s.tanya)}</p>
        ${s.opts.map((o, n) => `<button type="button" class="opsi ${Q.ans[Q.i] === n ? 'pilih' : ''}" data-o="${n}"><b>${huruf[n]}</b> ${esc(o.t)}</button>`).join('')}
      </div>
    </div>
    <div class="pager">
      <button type="button" class="btn alt" id="prev" ${Q.i === 0 ? 'disabled' : ''}>&lt;- Previous</button>
      ${Q.i < Q.list.length - 1 ? '<button type="button" class="btn" id="next">Next -&gt;</button>' : '<button type="button" class="btn sukses" id="submit">Submit</button>'}
    </div>
    <p class="muted"><a href="#/latihan" id="batal">Batalkan kuis</a></p>
  </section>`;
  app.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { Q.ans[Q.i] = +b.dataset.o; tampilSoal(); });
  app.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { Q.i = +b.dataset.n; tampilSoal(); });
  document.getElementById('prev').onclick = () => { if (Q.i > 0) { Q.i--; tampilSoal(); } };
  const nx = document.getElementById('next'); if (nx) nx.onclick = () => { if (Q.i < Q.list.length - 1) { Q.i++; tampilSoal(); } };
  const sb = document.getElementById('submit'); if (sb) sb.onclick = selesai;
  document.getElementById('batal').onclick = e => { e.preventDefault(); latihan(); };
  rumus(app);
}

function selesai() {
  const kosong = Q.ans.filter(a => a === null).length;
  if (kosong && !confirm(`Masih ada ${kosong} soal yang belum dijawab. Tetap kumpulkan?`)) return;
  clearInterval(timer);
  const durasi = (Date.now() - Q.t0) / 1000;
  const benar = Q.list.filter((s, n) => Q.ans[n] !== null && s.opts[Q.ans[n]].ok).length;
  const total = Q.list.length, salah = total - benar - kosong, skor = Math.round(benar / total * 100);
  const bintangAktif = Math.max(1, Math.round(skor / 20));
  const deretBintang = [1, 2, 3, 4, 5].map(i => `<svg class="${i <= bintangAktif ? 'px-bounce' : ''}" viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges"><rect x="7" y="1" width="2" height="3" fill="#231924"/><rect x="2" y="5" width="12" height="3" fill="#231924"/><rect x="4" y="8" width="8" height="4" fill="#231924"/><rect x="3" y="12" width="3" height="3" fill="#231924"/><rect x="10" y="12" width="3" height="3" fill="#231924"/><rect x="7" y="2" width="2" height="10" fill="${i <= bintangAktif ? '#ffea00' : '#a89ca8'}"/><rect x="3" y="6" width="10" height="2" fill="${i <= bintangAktif ? '#ffea00' : '#a89ca8'}"/><rect x="5" y="8" width="6" height="3" fill="${i <= bintangAktif ? '#ffbe0b' : '#8b808f'}"/><rect x="4" y="11" width="2" height="3" fill="${i <= bintangAktif ? '#ffea00' : '#a89ca8'}"/><rect x="10" y="11" width="2" height="3" fill="${i <= bintangAktif ? '#ffea00' : '#a89ca8'}"/></svg>`).join('');
  const huruf = 'ABCD';
  app.innerHTML = `
  <section class="page">
    <div class="card skor">
      ${winBar('SCORE_RESULT.EXE', 'bar-pink')}
      <div class="win-body">
        <div class="star-row" aria-hidden="true">${deretBintang}</div>
        <h1>${skor}%</h1>
        <p>${skor >= 80 ? 'Hasil sangat baik, materi sudah dikuasai.' : skor >= 60 ? 'Cukup baik, perkuat lagi di beberapa bagian.' : 'Pelajari kembali materinya, lalu coba ulangi.'}</p>
        <div class="stats mini"><div><b>${benar}</b><span>Benar</span></div><div><b>${salah}</b><span>Salah</span></div><div><b>${kosong}</b><span>Kosong</span></div><div><b>${waktu(durasi)}</b><span>Waktu</span></div></div>
        <button type="button" class="btn" id="ulang">Ulangi Kuis</button> <a class="btn alt" href="#/latihan" id="pilih-lain">Pilih Kategori Lain</a>
      </div>
    </div>
    <h2 class="judul-bagian">Pembahasan</h2>
    ${Q.list.map((s, n) => {
      const a = Q.ans[n], ok = a !== null && s.opts[a].ok, benarIdx = s.opts.findIndex(o => o.ok);
      return `<div class="card bahas ${ok ? 'ok' : 'no'}">
        ${winBar(`PEMBAHASAN_${String(n + 1).padStart(2, '0')}.LOG [${ok ? 'BENAR' : 'SALAH'}]`, ok ? 'bar-mint' : 'bar-coral')}
        <div class="win-body">
          <p><b>${n + 1}. ${esc(s.tanya)}</b></p>
          <p>Jawabanmu: ${a === null ? '<i>tidak dijawab</i>' : `${huruf[a]}. ${esc(s.opts[a].t)}`} <b>(${ok ? 'Benar' : 'Salah'})</b></p>
          ${ok ? '' : `<p>Jawaban benar: <b>${huruf[benarIdx]}. ${esc(s.opts[benarIdx].t)}</b></p>`}
          <p class="muted">${esc(s.jelas)}</p>
        </div>
      </div>`;
    }).join('')}
  </section>`;
  const kat = Q.kat;
  document.getElementById('ulang').onclick = () => mulai(kat);
  document.getElementById('pilih-lain').onclick = e => { e.preventDefault(); latihan(); };
  rumus(app);
}

route();
