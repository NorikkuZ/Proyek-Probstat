// js/app.js
// Logika utama: navigasi (router berbasis #hash), halaman beranda, materi, dan latihan soal.

const app = document.getElementById('app');
let timer = null;                                  // interval timer kuis

// ---------- utilitas ----------
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const acak = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const katNama = id => (KATEGORI.find(k => k.id === id) || {}).nama || id;

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

// ---------- router ----------
function route() {
  clearInterval(timer); Q = null;
  if (typeof bersihChart === 'function') bersihChart();
  const [, page = '', arg] = location.hash.split('/');
  document.querySelectorAll('#menu a').forEach(a => a.classList.toggle('aktif', a.dataset.p === page));
  ({ '': beranda, materi: materi, simulasi: simulasi, latihan: latihan }[page] || beranda)(arg);
  rumus(app);
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
window.addEventListener('load', route);

// ---------- BERANDA ----------
function beranda() {
  app.innerHTML = `
  <section class="hero">
    <div>
      <h1>Kuasai Probabilitas dan Statistika dengan Mudah</h1>
      <p>StatPeluang adalah platform belajar interaktif: materi lengkap dari konsep dasar peluang sampai semua jenis distribusi, simulasi yang bisa diubah parameternya, dan latihan soal dengan pembahasan.</p>
      <a class="btn" href="#/materi">Mulai Belajar</a> <a class="btn alt" href="#/latihan">Coba Latihan Soal</a>
    </div>
    <div class="hero-art" aria-hidden="true">🎲 🔔 📊</div>
  </section>
  <section class="stats">
    <div><b>${MATERI.length}</b><span>Materi</span></div>
    <div><b>${SOAL.length}</b><span>Latihan Soal</span></div>
    <div><b>${KATEGORI.length}</b><span>Kategori</span></div>
  </section>
  <h2 class="judul-bagian">Kategori Pembelajaran</h2>
  <section class="grid">
    ${KATEGORI.map(k => {
      const pertama = MATERI.find(m => m.kat === k.id);
      return `<a class="card kat" href="#/materi/${pertama.id}"><div class="ikon">${k.ikon}</div><h3>${k.nama}</h3><p>${k.desk}</p><small>${MATERI.filter(m => m.kat === k.id).length} materi · ${SOAL.filter(s => s.kat === k.id).length} soal</small></a>`;
    }).join('')}
  </section>`;
}

// ---------- MATERI ----------
function materi(id) {
  const idx = Math.max(0, MATERI.findIndex(m => m.id === id));
  const m = MATERI[idx];
  const sisi = KATEGORI.map(k => `<h4>${k.ikon} ${k.nama}</h4>` +
    MATERI.filter(x => x.kat === k.id).map(x => `<a href="#/materi/${x.id}" class="${x.id === m.id ? 'aktif' : ''}">${x.judul}</a>`).join('')).join('');
  const prev = MATERI[idx - 1], next = MATERI[idx + 1];
  app.innerHTML = `
  <section class="materi-wrap">
    <aside class="sidebar">${sisi}</aside>
    <article class="card isi">
      <span class="badge">${katNama(m.kat)}</span>
      <h1>${m.judul}</h1>
      <h3>Penjelasan</h3>${fmt(m.isi)}
      <h3>Rumus Utama</h3>${m.rumus.map(r => `<div class="rumus">$$${esc(r)}$$</div>`).join('')}
      <h3>Contoh Soal</h3>${fmt(m.contoh)}
      <details><summary>Lihat pembahasan langkah demi langkah</summary>${fmt(m.bahas)}</details>
      <div class="pager">
        ${prev ? `<a class="btn alt" href="#/materi/${prev.id}">← ${prev.judul}</a>` : '<span></span>'}
        ${next ? `<a class="btn" href="#/materi/${next.id}">${next.judul} →</a>` : `<a class="btn" href="#/latihan">Kerjakan Latihan →</a>`}
      </div>
    </article>
  </section>`;
  // rumus di dalam <details> yang tertutup tetap dirender oleh route() -> rumus(app)
}

// ---------- LATIHAN SOAL ----------
let Q = null;                                      // state kuis yang sedang berjalan

function latihan() {
  app.innerHTML = `
  <section class="page">
    <h1>Latihan Soal</h1>
    <p class="muted">Pilih kategori. Soal dan urutan pilihan jawaban diacak setiap kali kuis dimulai. Jawaban dan pembahasan ditampilkan setelah kamu menekan Submit.</p>
    <div class="grid">
      ${KATEGORI.map(k => `<button class="card kat tombol" data-k="${k.id}"><div class="ikon">${k.ikon}</div><h3>${k.nama}</h3><small>${SOAL.filter(s => s.kat === k.id).length} soal</small></button>`).join('')}
      <button class="card kat tombol gabungan" data-k="gabungan"><div class="ikon">🏆</div><h3>Kuis Gabungan</h3><small>15 soal acak dari semua materi</small></button>
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
    <div class="kuis-head"><h2>${judul}</h2><div class="timer">⏱ <span id="timer">${waktu((Date.now() - Q.t0) / 1000)}</span></div></div>
    <div class="nomor">${Q.list.map((_, n) => `<button class="${n === Q.i ? 'now' : ''} ${Q.ans[n] !== null ? 'jwb' : ''}" data-n="${n}">${n + 1}</button>`).join('')}</div>
    <div class="card">
      <p class="tanya"><b>Soal ${Q.i + 1} dari ${Q.list.length}</b><br>${esc(s.tanya)}</p>
      ${s.opts.map((o, n) => `<button class="opsi ${Q.ans[Q.i] === n ? 'pilih' : ''}" data-o="${n}"><b>${huruf[n]}</b> ${esc(o.t)}</button>`).join('')}
    </div>
    <div class="pager">
      <button class="btn alt" id="prev" ${Q.i === 0 ? 'disabled' : ''}>← Previous</button>
      ${Q.i < Q.list.length - 1 ? '<button class="btn" id="next">Next →</button>' : '<button class="btn sukses" id="submit">Submit</button>'}
    </div>
    <p class="muted"><a href="#/latihan">Batalkan kuis</a></p>
  </section>`;
  app.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { Q.ans[Q.i] = +b.dataset.o; tampilSoal(); });
  app.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { Q.i = +b.dataset.n; tampilSoal(); });
  document.getElementById('prev').onclick = () => { Q.i--; tampilSoal(); };
  const nx = document.getElementById('next'); if (nx) nx.onclick = () => { Q.i++; tampilSoal(); };
  const sb = document.getElementById('submit'); if (sb) sb.onclick = selesai;
}

function selesai() {
  const kosong = Q.ans.filter(a => a === null).length;
  if (kosong && !confirm(`Masih ada ${kosong} soal yang belum dijawab. Tetap kumpulkan?`)) return;
  clearInterval(timer);
  const durasi = (Date.now() - Q.t0) / 1000;
  const benar = Q.list.filter((s, n) => Q.ans[n] !== null && s.opts[Q.ans[n]].ok).length;
  const total = Q.list.length, salah = total - benar - kosong, skor = Math.round(benar / total * 100);
  const huruf = 'ABCD';
  app.innerHTML = `
  <section class="page">
    <div class="card skor">
      <h1>${skor}%</h1>
      <p>${skor >= 80 ? 'Bagus sekali! 🎉' : skor >= 60 ? 'Cukup baik, terus berlatih 💪' : 'Pelajari lagi materinya, lalu coba ulangi 📚'}</p>
      <div class="stats mini"><div><b>${benar}</b><span>Benar</span></div><div><b>${salah}</b><span>Salah</span></div><div><b>${kosong}</b><span>Kosong</span></div><div><b>${waktu(durasi)}</b><span>Waktu</span></div></div>
      <button class="btn" id="ulang">Ulangi Kuis</button> <a class="btn alt" href="#/latihan">Pilih Kategori Lain</a>
    </div>
    <h2>Pembahasan</h2>
    ${Q.list.map((s, n) => {
      const a = Q.ans[n], ok = a !== null && s.opts[a].ok, benarIdx = s.opts.findIndex(o => o.ok);
      return `<div class="card bahas ${ok ? 'ok' : 'no'}">
        <p><b>${n + 1}. ${esc(s.tanya)}</b></p>
        <p>Jawabanmu: ${a === null ? '<i>tidak dijawab</i>' : `${huruf[a]}. ${esc(s.opts[a].t)}`} ${ok ? '✅' : '❌'}</p>
        ${ok ? '' : `<p>Jawaban benar: <b>${huruf[benarIdx]}. ${esc(s.opts[benarIdx].t)}</b></p>`}
        <p class="muted">${esc(s.jelas)}</p></div>`;
    }).join('')}
  </section>`;
  const kat = Q.kat;
  document.getElementById('ulang').onclick = () => mulai(kat);
}
