/* ====================================================
   ESTRÁFINAN — script.js
==================================================== */

// ── MENÚ MÓVIL ───────────────────────────────────────
(() => {
  const btn  = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Cierra al hacer clic en un enlace
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
    });
  });

  // Cierra al hacer clic fuera
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
    }
  });
})();

// ── HEADER SCROLL ────────────────────────────────────
(() => {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();

// ── SCROLL ANIMATIONS ────────────────────────────────
(() => {
  const els = document.querySelectorAll('[data-anim]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  els.forEach(el => io.observe(el));
})();

// ── TICKER LOGOS — duplicar para loop infinito ────────
(() => {
  const track = document.getElementById('logosTicker');
  if (!track || track.dataset.cloned === 'true') return;

  // Duplicar ítems para continuidad perfecta
  Array.from(track.children).forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  track.dataset.cloned = 'true';
})();

// ── TESTIMONIOS CON FADE ─────────────────────────────
(() => {
  const wrap     = document.getElementById('fadeTestimonials');
  const dotsWrap = document.getElementById('fadeDots');
  const prevBtn  = document.getElementById('prevFade');
  const nextBtn  = document.getElementById('nextFade');

  if (!wrap) return;

  const cards = Array.from(wrap.querySelectorAll('.fade-card'));
  let index = 0;
  let timer = null;

  // ── Crear dots ──
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => {
        index = i;
        show();
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
    });
  }

  function show() {
    cards.forEach((c, i) => c.classList.toggle('is-active', i === index));
    if (dotsWrap) {
      [...dotsWrap.children].forEach((d, i) => d.classList.toggle('is-active', i === index));
    }
  }

  function next() { index = (index + 1) % cards.length; show(); }
  function prev() { index = (index - 1 + cards.length) % cards.length; show(); }

  function startAutoplay()  { stopAutoplay(); timer = setInterval(next, 5000); }
  function stopAutoplay()   { if (timer) clearInterval(timer); }
  function restartAutoplay(){ startAutoplay(); }

  prevBtn?.addEventListener('click', () => { prev(); restartAutoplay(); });
  nextBtn?.addEventListener('click', () => { next(); restartAutoplay(); });

  wrap.addEventListener('mouseenter', stopAutoplay);
  wrap.addEventListener('mouseleave', startAutoplay);

  // Swipe táctil
  let startX = 0;
  wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 44) { dx < 0 ? next() : prev(); restartAutoplay(); }
  });

  show();
  startAutoplay();
})();