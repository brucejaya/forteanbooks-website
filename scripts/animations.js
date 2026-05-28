/* ────────────────────────────────────────────────────────────────────────────
   Fortean Books -- GSAP animations
   Display pages only: index, about, sell, partner, contact, info.
   NOT on shop.html or book detail pages.

   Principles:
   - Small y-travel (16-24px): motion that clarifies sequence, not spectacle
   - autoAlpha handles opacity + visibility together
   - clearProps: 'all' after each animation (no lingering inline styles)
   - immediateRender: true on all from() tweens -- GSAP applies the initial
     state synchronously when the tween is created, before any scroll event,
     so elements are hidden from the first paint and never flash
   - about-grid: element-level timeline, not whole-column block
   ─────────────────────────────────────────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/* Animate a single element from a state when it enters the viewport.
   immediateRender: true makes GSAP apply the from-state immediately on
   tween creation (synchronous, before any paint), preventing flash. */
function reveal(el, vars, start) {
  if (!el) return;
  gsap.from(el, Object.assign({ clearProps: 'all', immediateRender: true }, vars, {
    scrollTrigger: {
      trigger: el,
      start: start || 'top 70%',
      toggleActions: 'play none none none'
    }
  }));
}

/* Check if el is inside a container we handle elsewhere */
function inside(el, sel) {
  return !!el.closest(sel);
}

var HERO     = '.hero-centered, .page-hero, .about-hero';
var MANAGED  = HERO + ', .about-grid, .section-head, .pull-quote';


/* ── 1. Hero: page-load timeline ─────────────────────────────────────────────
   No scroll trigger -- fires immediately on script load. Gives the top section
   a purposeful, sequenced entrance. Selectors differ between index (.hero-centered)
   and inner pages (.page-hero / .about-hero).
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  var hero = document.querySelector(HERO);
  if (!hero) return;

  var eyebrow, h1, lead, cta;

  if (hero.classList.contains('hero-centered')) {
    /* index.html -- BEM element classes */
    eyebrow = hero.querySelector('.hero-centered__eyebrow');
    h1      = hero.querySelector('.hero-centered__title');
    lead    = hero.querySelector('.hero-centered__epigraph');
    cta     = hero.querySelector('.hero-centered__actions');
  } else {
    /* page-hero / about-hero -- generic classes */
    eyebrow = hero.querySelector('.eyebrow');
    h1      = hero.querySelector('h1');
    lead    = hero.querySelector('.lead');
    cta     = null;
  }

  var tl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'all' } });
  if (eyebrow) tl.from(eyebrow, { autoAlpha: 0, y: 14, duration: 0.65 }, 0.10);
  if (h1)      tl.from(h1,      { autoAlpha: 0, y: 32, duration: 0.85 }, 0.24);
  if (lead)    tl.from(lead,    { autoAlpha: 0, y: 20, duration: 0.75 }, 0.42);
  if (cta)     tl.from(cta,     { autoAlpha: 0, y: 18, duration: 0.65 }, 0.58);
}());


/* ── 2. About-grid: element-level timeline ───────────────────────────────────
   Each .about-grid creates its own scroll-triggered timeline.
   Eyebrow -> h2 -> right column, each entering with a slight offset.
   ─────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.about-grid').forEach(function(grid) {
  var eyebrow = grid.querySelector('.eyebrow');
  var h2      = grid.querySelector('h2');
  var muted   = grid.querySelector('.muted');
  var col2    = grid.children[1];

  var tl = gsap.timeline({
    defaults: { ease: 'power2.out', clearProps: 'all' },
    scrollTrigger: {
      trigger: grid,
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  });

  if (eyebrow) tl.from(eyebrow, { autoAlpha: 0, y: 14, duration: 0.55 }, 0);
  if (h2)      tl.from(h2,      { autoAlpha: 0, y: 22, duration: 0.72, ease: 'power3.out' }, 0.14);
  if (muted)   tl.from(muted,   { autoAlpha: 0,         duration: 0.55 }, 0.30);
  if (col2)    tl.from(col2,    { autoAlpha: 0, y: 16, duration: 0.70 }, 0.18);
});


/* ── 3. Section heads (.num + h2 pairing) ────────────────────────────────── */
document.querySelectorAll('.section-head').forEach(function(el) {
  var num = el.querySelector('.num');
  var h2  = el.querySelector('h2');
  var tl  = gsap.timeline({
    defaults: { ease: 'power3.out', clearProps: 'all' },
    scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none none' }
  });
  if (num) tl.from(num, { autoAlpha: 0, y: 14, duration: 0.6  }, 0);
  if (h2)  tl.from(h2,  { autoAlpha: 0, y: 24, duration: 0.78 }, 0.16);
});


/* ── 4. Eyebrows -- standalone (not already handled above) ───────────────── */
document.querySelectorAll('.eyebrow').forEach(function(el) {
  if (inside(el, MANAGED)) return;
  reveal(el, { autoAlpha: 0, y: 12, duration: 0.55, ease: 'power2.out' });
});


/* ── 5. H2 headings -- standalone ────────────────────────────────────────── */
document.querySelectorAll('h2').forEach(function(el) {
  if (inside(el, MANAGED)) return;
  reveal(el, { autoAlpha: 0, y: 24, duration: 0.78, ease: 'power3.out' }, 'top 70%');
});


/* ── 6. HR rules -- wipe in from left ────────────────────────────────────── */
document.querySelectorAll('hr').forEach(function(el) {
  reveal(
    el,
    { scaleX: 0, transformOrigin: 'left center', duration: 1.0, ease: 'power2.inOut' },
    'top 80%'
  );
});


/* ── 7. Pull quote ───────────────────────────────────────────────────────── */
document.querySelectorAll('.pull-quote').forEach(function(el) {
  reveal(el, { autoAlpha: 0, scale: 0.98, duration: 0.85, ease: 'power2.out' }, 'top 70%');
});


/* ── 8. Staggered groups ─────────────────────────────────────────────────── */
/* Per-element reveals rather than ScrollTrigger.batch -- eliminates flash.
   gsap.from() with immediateRender:true hides each element synchronously
   the moment the script runs, before any paint. No visible snap ever occurs.
   Feature-cards and subject-list items intentionally excluded (above the fold). */

document.querySelectorAll('.process-step').forEach(function(el) {
  reveal(el, { autoAlpha: 0, y: 24, duration: 0.68, ease: 'power3.out' });
});

document.querySelectorAll('.contact-option').forEach(function(el) {
  reveal(el, { autoAlpha: 0, y: 22, duration: 0.65, ease: 'power2.out' });
});

document.querySelectorAll('.shortcut-card').forEach(function(el) {
  reveal(el, { autoAlpha: 0, y: 26, duration: 0.68, ease: 'power3.out' });
});

document.querySelectorAll('.scope-list li').forEach(function(el) {
  reveal(el, { autoAlpha: 0, y: 18, duration: 0.62, ease: 'power2.out' });
});
