// js/intro.js
// Layar pembuka "Truk Petualangan": klik di mana saja -> mesin nyala -> tancap gas -> Home Desktop muncul.
// File ini berdiri sendiri: tidak mengubah router/kuis/simulasi di file js lain.

(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;
  const body = document.body;
  const kurangGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let jalan = false;          // true selama animasi berangkat (cegah klik ganda)
  let keHome = false;         // true bila intro dibuka lewat tombol INTRO di Home
  let antrean = [];           // daftar setTimeout aktif
  const tunda = (fn, ms) => antrean.push(setTimeout(fn, ms));
  const bersihAntrean = () => { antrean.forEach(clearTimeout); antrean = []; };

  // Fase 2 selesai: tampilkan desktop, overlay memudar
  function bukaDesktop() {
    intro.classList.add('memudar');
    body.classList.remove('intro-aktif');
    body.classList.add('desktop-muncul');
    // Intro dibuka manual dari halaman lain -> mendarat di Home. Buka pertama kali -> tetap di tujuan awal.
    if (keHome && location.hash !== '' && location.hash !== '#/') location.hash = '#/';
  }

  // Overlay benar-benar disembunyikan
  function tutup() {
    intro.hidden = true;
    intro.classList.remove('fase-mesin', 'fase-gas', 'memudar');
    tunda(() => body.classList.remove('desktop-muncul'), 500);
    jalan = false;
    keHome = false;
  }

  function mulai() {
    if (jalan) return;
    jalan = true;
    if (kurangGerak) {                      // tanpa animasi: langsung pudar
      bukaDesktop();
      tunda(tutup, 300);
      return;
    }
    intro.classList.add('fase-mesin');      // fase 1: mesin nyala (0,5 dtk)
    tunda(() => {                           // fase 2: tancap gas (0,9 dtk)
      intro.classList.remove('fase-mesin');
      intro.classList.add('fase-gas');
    }, 500);
    tunda(bukaDesktop, 1100);               // truk hampir keluar: crossfade ke desktop
    tunda(tutup, 1500);
  }

  // Dipanggil tombol INTRO (navbar, ikon desktop, taskbar). Tidak memanggil route() -> kuis/timer aman.
  function bukaIntro() {
    bersihAntrean();
    intro.classList.remove('fase-mesin', 'fase-gas', 'memudar', 'masuk');
    body.classList.remove('desktop-muncul');
    body.classList.add('intro-aktif');
    intro.hidden = false;
    void intro.offsetWidth;                 // paksa reflow supaya animasi masuk ulang
    intro.classList.add('masuk');
    window.scrollTo(0, 0);
    jalan = false;
    keHome = true;
    intro.focus({ preventScroll: true });
  }

  intro.addEventListener('click', mulai);
  intro.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === intro) { e.preventDefault(); mulai(); }
  });
  document.querySelectorAll('[data-intro]').forEach(b => b.addEventListener('click', bukaIntro));

  intro.focus({ preventScroll: true });
})();
