/* ────────────────────────────────────────────────────────────────────────────
   Fortean Books -- GSAP animations
   Display pages only: index, about, sell, partner, contact, info.
   NOT on shop.html or book detail pages.

   Flash-free pattern throughout:
     gsap.set(el, fromState)   -- hides element synchronously on script load,
                                  before any paint or scroll event fires
     gsap.to(el,  toState)     -- reveals when trigger fires
   This avoids the "show -> snap to hidden -> animate in" pattern that
   gsap.from() / tl.from() produce when the element is already painted.
   ─────────────────────────────────────────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/* Hide el immediately, then reveal it when it enters the viewport.
   gsap.set is synchronous -- runs before any paint.  */
function reveal(el, fromVars, start) {
  if (!el) return;
  gsap.set(el, fromVars);
  gsap.to(el, Object.assign({}, fromVars, {
    /* override every animated property to its natural value */
    autoAlpha: 1, y: 0, scale: 1, scaleX: 1,
    duration:   fromVars.duration  || 0.7,
    ease:       fromVars.ease      || 'power2.out',
    clearProps: 'all',
    scrollTrigger: {
      trigger: el,
      start:   start || 'top 70%',
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
   gsap.set() hides all hero elements before the timeline starts, so there
   is no flash between first paint and the first timeline step.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  var hero = document.querySelector(HERO);
  if (!hero) return;

  var eyebrow, h1, lead, cta;

  if (hero.classList.contains('hero-centered')) {
    eyebrow = hero.querySelector('.hero-centered__eyebrow');
    h1      = hero.querySelector('.hero-centered__title');
    lead    = hero.querySelector('.hero-centered__epigraph');
    cta     = hero.querySelector('.hero-centered__actions');
  } else {
    eyebrow = hero.querySelector('.eyebrow');
    h1      = hero.querySelector('h1');
    lead    = hero.querySelector('.lead');
    cta     = null;
  }

  /* Hide immediately */
  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 14 });
  if (h1)      gsap.set(h1,      { autoAlpha: 0, y: 32 });
  if (lead)    gsap.set(lead,    { autoAlpha: 0, y: 20 });
  if (cta)     gsap.set(cta,     { autoAlpha: 0, y: 18 });

  /* Reveal in sequence */
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.65, clearProps: 'all' }, 0.10);
  if (h1)      tl.to(h1,      { autoAlpha: 1, y: 0, duration: 0.85, clearProps: 'all' }, 0.24);
  if (lead)    tl.to(lead,    { autoAlpha: 1, y: 0, duration: 0.75, clearProps: 'all' }, 0.42);
  if (cta)     tl.to(cta,     { autoAlpha: 1, y: 0, duration: 0.65, clearProps: 'all' }, 0.58);
}());


/* ── 2. About-grid: element-level timeline ───────────────────────────────────
   Each element is pre-hidden via gsap.set() so the grid is invisible from
   script-load onwards. Timeline reveals elements when the grid scrolls in.
   ─────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.about-grid').forEach(function(grid) {
  var eyebrow = grid.querySelector('.eyebrow');
  var h2      = grid.querySelector('h2');
  var muted   = grid.querySelector('.muted');
  var col2    = grid.children[1];

  /* Hide immediately */
  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 14 });
  if (h2)      gsap.set(h2,      { autoAlpha: 0, y: 22 });
  if (muted)   gsap.set(muted,   { autoAlpha: 0 });
  if (col2)    gsap.set(col2,    { autoAlpha: 0, y: 16 });

  var tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: grid,
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  });

  if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55, clearProps: 'all' }, 0);
  if (h2)      tl.to(h2,      { autoAlpha: 1, y: 0, duration: 0.72, ease: 'power3.out', clearProps: 'all' }, 0.14);
  if (muted)   tl.to(muted,   { autoAlpha: 1,        duration: 0.55, clearProps: 'all' }, 0.30);
  if (col2)    tl.to(col2,    { autoAlpha: 1, y: 0, duration: 0.70, clearProps: 'all' }, 0.18);
});


/* ── 3. Section heads (.num + h2 pairing) ────────────────────────────────── */
document.querySelectorAll('.section-head').forEach(function(el) {
  var num = el.querySelector('.num');
  var h2  = el.querySelector('h2');

  if (num) gsap.set(num, { autoAlpha: 0, y: 14 });
  if (h2)  gsap.set(h2,  { autoAlpha: 0, y: 24 });

  var tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none none' }
  });
  if (num) tl.to(num, { autoAlpha: 1, y: 0, duration: 0.6,  clearProps: 'all' }, 0);
  if (h2)  tl.to(h2,  { autoAlpha: 1, y: 0, duration: 0.78, clearProps: 'all' }, 0.16);
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
  reveal(el, { scaleX: 0, duration: 1.0, ease: 'power2.inOut', transformOrigin: 'left center' }, 'top 80%');
});


/* ── 7. Pull quote ───────────────────────────────────────────────────────── */
document.querySelectorAll('.pull-quote').forEach(function(el) {
  reveal(el, { autoAlpha: 0, scale: 0.98, duration: 0.85, ease: 'power2.out' }, 'top 70%');
});


/* ── 8. Staggered groups (per-element reveals) ───────────────────────────── */
/* Feature-cards and subject-list items excluded -- above the fold. */

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
