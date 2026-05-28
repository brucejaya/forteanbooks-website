/* ────────────────────────────────────────────────────────────────────────────
   Fortean Books -- GSAP animations
   Display pages: index, about, sell, partner, contact, info.
   Not on shop.html or book detail pages.

   Motion vocabulary
   -----------------
   Single language throughout: elements rise from slightly below with a fade.
   y-travel scales with visual weight (h1 32px > cards 24px > text 12-16px).
   Duration 0.55–0.85s, power2/3.out easing, clearProps after every tween.

   Flash-free pattern
   ------------------
   gsap.set()  hides the element synchronously when the script runs,
               before the browser fires the next paint event.
   gsap.to()   reveals it when the scroll trigger fires.
   This eliminates the "visible → snap hidden → animate in" sequence.
   ─────────────────────────────────────────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);


/* ── Helpers ─────────────────────────────────────────────────────────────── */

/* Hide el immediately, reveal it when it reaches the viewport threshold.
   fromVars drives both the initial gsap.set() state and the animation
   parameters (duration, ease). The to() always returns to the natural state
   (autoAlpha:1, y:0, scale:1, scaleX:1). */
function reveal(el, fromVars, start) {
  if (!el) return;
  gsap.set(el, fromVars);
  gsap.to(el, {
    autoAlpha:  1,
    y:          0,
    scale:      fromVars.scale  !== undefined ? 1 : undefined,
    scaleX:     fromVars.scaleX !== undefined ? 1 : undefined,
    duration:   fromVars.duration || 0.68,
    ease:       fromVars.ease     || 'power2.out',
    clearProps: 'all',
    transformOrigin: fromVars.transformOrigin || undefined,
    scrollTrigger: {
      trigger: el,
      start:   start || 'top 70%',
      toggleActions: 'play none none none'
    }
  });
}

/* True if el has a managed ancestor — prevents double-animating sub-elements */
function inside(el, sel) { return !!el.closest(sel); }

/* Containers whose sub-elements we handle directly (exclude from sweep handlers) */
var HERO    = '.hero-centered, .page-hero, .about-hero';
var MANAGED = HERO +
  ', .about-grid, .section-head, .pull-quote, .newsletter' +
  ', .contact-option, .shortcut-card, .process-step, .feature-card';


/* ── 1. Hero ──────────────────────────────────────────────────────────────────
   Fires on page load — no scroll trigger. Sequence communicates hierarchy:
   eyebrow establishes the section, then h1 lands, then supporting copy.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  var hero = document.querySelector(HERO);
  if (!hero) return;

  var eyebrow, h1, lead, cta;

  if (hero.classList.contains('hero-centered')) {
    /* index.html uses BEM modifier classes */
    eyebrow = hero.querySelector('.hero-centered__eyebrow');
    h1      = hero.querySelector('.hero-centered__title');
    lead    = hero.querySelector('.hero-centered__epigraph');
    cta     = hero.querySelector('.hero-centered__actions');
  } else {
    /* page-hero / about-hero on inner pages */
    eyebrow = hero.querySelector('.eyebrow');
    h1      = hero.querySelector('h1');
    lead    = hero.querySelector('.lead');
    cta     = null;
  }

  /* Pre-hide all elements before the timeline runs.
     gsap.set() writes inline styles that take precedence over the
     .pre-anim CSS rule, so we can safely remove that class immediately
     after without any visible change — clearProps at animation end
     then removes the inline styles to a clean state. */
  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 14 });
  if (h1)      gsap.set(h1,      { autoAlpha: 0, y: 32 });
  if (lead)    gsap.set(lead,    { autoAlpha: 0, y: 20 });
  if (cta)     gsap.set(cta,     { autoAlpha: 0, y: 18 });
  document.documentElement.classList.remove('pre-anim');

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.65, clearProps: 'all' }, 0.10);
  if (h1)      tl.to(h1,      { autoAlpha: 1, y: 0, duration: 0.85, clearProps: 'all' }, 0.24);
  if (lead)    tl.to(lead,    { autoAlpha: 1, y: 0, duration: 0.75, clearProps: 'all' }, 0.42);
  if (cta)     tl.to(cta,     { autoAlpha: 1, y: 0, duration: 0.65, clearProps: 'all' }, 0.58);
}());


/* ── 2. About-grid ────────────────────────────────────────────────────────────
   Element-level timeline per grid instance. Left column: eyebrow → h2 → muted
   text, each beat slightly later. Right column comes in on the same beat as
   the h2 so the two sides feel like they're turning together.
   ─────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.about-grid').forEach(function(grid) {
  var eyebrow = grid.querySelector('.eyebrow');
  var h2      = grid.querySelector('h2');
  var muted   = grid.querySelector('.muted');
  var col2    = grid.children[1];

  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 14 });
  if (h2)      gsap.set(h2,      { autoAlpha: 0, y: 22 });
  if (muted)   gsap.set(muted,   { autoAlpha: 0 });
  if (col2)    gsap.set(col2,    { autoAlpha: 0, y: 18 });

  var tl = gsap.timeline({
    scrollTrigger: { trigger: grid, start: 'top 70%', toggleActions: 'play none none none' }
  });
  if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out',  clearProps: 'all' }, 0);
  if (h2)      tl.to(h2,      { autoAlpha: 1, y: 0, duration: 0.72, ease: 'power3.out',  clearProps: 'all' }, 0.14);
  if (muted)   tl.to(muted,   { autoAlpha: 1,        duration: 0.55, ease: 'power2.out',  clearProps: 'all' }, 0.30);
  if (col2)    tl.to(col2,    { autoAlpha: 1, y: 0, duration: 0.70, ease: 'power2.out',  clearProps: 'all' }, 0.18);
});


/* ── 3. Section heads ─────────────────────────────────────────────────────── */
document.querySelectorAll('.section-head').forEach(function(el) {
  var num = el.querySelector('.num');
  var h2  = el.querySelector('h2');

  if (num) gsap.set(num, { autoAlpha: 0, y: 14 });
  if (h2)  gsap.set(h2,  { autoAlpha: 0, y: 24 });

  var tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none none' }
  });
  if (num) tl.to(num, { autoAlpha: 1, y: 0, duration: 0.60, ease: 'power3.out', clearProps: 'all' }, 0);
  if (h2)  tl.to(h2,  { autoAlpha: 1, y: 0, duration: 0.78, ease: 'power3.out', clearProps: 'all' }, 0.16);
});


/* ── 4. Newsletter ────────────────────────────────────────────────────────────
   Treated as a two-column layout: both columns animate as blocks, left first,
   right 0.16s later. Adding .newsletter to MANAGED prevents the standalone
   eyebrow / h2 sweeps from double-animating content inside it.
   ─────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.newsletter__grid').forEach(function(grid) {
  var col1 = grid.children[0];
  var col2 = grid.children[1];

  if (col1) gsap.set(col1, { autoAlpha: 0, y: 18 });
  if (col2) gsap.set(col2, { autoAlpha: 0, y: 18 });

  var tl = gsap.timeline({
    scrollTrigger: { trigger: grid, start: 'top 70%', toggleActions: 'play none none none' }
  });
  if (col1) tl.to(col1, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', clearProps: 'all' }, 0);
  if (col2) tl.to(col2, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out', clearProps: 'all' }, 0.16);
});


/* ── 5. Feature cards ─────────────────────────────────────────────────────────
   All cards in a grid share a single scroll trigger (the grid container).
   When the grid enters view, cards cascade left-to-right at 0.09 s intervals.
   This preserves reading order and feels like books being laid out on a table.
   ─────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.feature-grid').forEach(function(grid) {
  var cards = grid.querySelectorAll('.feature-card');
  if (!cards.length) return;

  cards.forEach(function(card) { gsap.set(card, { autoAlpha: 0, y: 24 }); });

  var tl = gsap.timeline({
    scrollTrigger: { trigger: grid, start: 'top 75%', toggleActions: 'play none none none' }
  });
  cards.forEach(function(card, i) {
    tl.to(card, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out', clearProps: 'all' }, i * 0.09);
  });
});

/* "See the full catalogue" link below the feature grid */
document.querySelectorAll('.feature-grid__footer').forEach(function(el) {
  reveal(el, { autoAlpha: 0, y: 16, duration: 0.55, ease: 'power2.out' });
});


/* ── 6. Subject list ──────────────────────────────────────────────────────────
   Each row enters slightly after the previous, reading downwards.
   0.07 s stagger over 6 rows = 0.42 s total cascade — quick and purposeful.
   ─────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.subject-list').forEach(function(list) {
  var items = list.querySelectorAll('li');
  if (!items.length) return;

  items.forEach(function(item) { gsap.set(item, { autoAlpha: 0, y: 16 }); });

  var tl = gsap.timeline({
    scrollTrigger: { trigger: list, start: 'top 75%', toggleActions: 'play none none none' }
  });
  items.forEach(function(item, i) {
    tl.to(item, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'all' }, i * 0.07);
  });
});


/* ── 7. Standalone eyebrows (not inside a managed container) ─────────────── */
document.querySelectorAll('.eyebrow').forEach(function(el) {
  if (inside(el, MANAGED)) return;
  reveal(el, { autoAlpha: 0, y: 12, duration: 0.55, ease: 'power2.out' });
});


/* ── 8. Standalone h2 headings ───────────────────────────────────────────── */
document.querySelectorAll('h2').forEach(function(el) {
  if (inside(el, MANAGED)) return;
  reveal(el, { autoAlpha: 0, y: 24, duration: 0.78, ease: 'power3.out' });
});


/* ── 9. HR rules — wipe from left ────────────────────────────────────────── */
document.querySelectorAll('hr').forEach(function(el) {
  reveal(el,
    { scaleX: 0, transformOrigin: 'left center', duration: 0.90, ease: 'power2.inOut' },
    'top 80%'
  );
});


/* ── 10. Pull quotes ──────────────────────────────────────────────────────── */
document.querySelectorAll('.pull-quote').forEach(function(el) {
  reveal(el, { autoAlpha: 0, scale: 0.97, duration: 0.85, ease: 'power2.out' }, 'top 70%');
});


/* ── 11. Process steps (sell + partner) ──────────────────────────────────── */
document.querySelectorAll('.process-step').forEach(function(el) {
  reveal(el, { autoAlpha: 0, y: 22, duration: 0.65, ease: 'power3.out' });
});


/* ── 12. Contact options ─────────────────────────────────────────────────── */
document.querySelectorAll('.contact-option').forEach(function(el) {
  reveal(el, { autoAlpha: 0, y: 20, duration: 0.65, ease: 'power2.out' });
});


/* ── 13. Shortcut cards (contact page) ───────────────────────────────────── */
document.querySelectorAll('.shortcut-card').forEach(function(el) {
  reveal(el, { autoAlpha: 0, y: 22, duration: 0.65, ease: 'power3.out' });
});


/* ── 14. Scope list (about page) ─────────────────────────────────────────── */
document.querySelectorAll('.scope-list li').forEach(function(el) {
  reveal(el, { autoAlpha: 0, y: 16, duration: 0.62, ease: 'power2.out' });
});
