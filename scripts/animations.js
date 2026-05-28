/* ────────────────────────────────────────────────────────────────────────────
   Fortean Books -- GSAP animations
   Display pages only: index, about, sell, partner, contact, info.
   NOT on shop.html or book detail pages.

   Principles:
   - Small y-travel (16-24px): motion that clarifies sequence, not spectacle
   - autoAlpha handles opacity + visibility together
   - clearProps: 'all' after each animation (no lingering inline styles)
   - about-grid: element-level timeline, not whole-column block
   - ScrollTrigger.batch for staggered lists
   ─────────────────────────────────────────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/* Animate a single element from a state, triggered when it enters viewport */
function reveal(el, vars, start) {
  if (!el) return;
  gsap.from(el, Object.assign({ clearProps: 'all' }, vars, {
    scrollTrigger: {
      trigger: el,
      start: start || 'top 89%',
      toggleActions: 'play none none none'
    }
  }));
}

/* Stagger a list of like elements with ScrollTrigger.batch --
   naturally groups rows of a grid as they enter viewport together. */
function stagger(selector, vars, gap) {
  if (!document.querySelector(selector)) return;
  ScrollTrigger.batch(selector, {
    start: 'top 90%',
    onEnter: function(batch) {
      gsap.from(batch, Object.assign({ clearProps: 'all', stagger: gap || 0.1 }, vars));
    }
  });
}

/* Check if el is inside a container we handle elsewhere */
function inside(el, sel) {
  return !!el.closest(sel);
}

var HERO     = '.hero-centered, .page-hero, .about-hero';
var MANAGED  = HERO + ', .about-grid, .section-head, .pull-quote';


/* ── 1. Hero: page-load timeline ─────────────────────────────────────────────
   No scroll trigger — fires immediately on script load. Gives the top section
   a purposeful, sequenced entrance.
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  var hero = document.querySelector(HERO);
  if (!hero) return;

  var eyebrow = hero.querySelector('.eyebrow');
  var h1      = hero.querySelector('h1');
  var lead    = hero.querySelector('.lead');
  var cta     = hero.querySelector('.hero-centered__actions');

  var tl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'all' } });
  if (eyebrow) tl.from(eyebrow, { autoAlpha: 0, y: 14, duration: 0.65 }, 0.10);
  if (h1)      tl.from(h1,      { autoAlpha: 0, y: 32, duration: 0.85 }, 0.24);
  if (lead)    tl.from(lead,    { autoAlpha: 0, y: 20, duration: 0.75 }, 0.42);
  if (cta)     tl.from(cta,     { autoAlpha: 0, y: 18, duration: 0.65 }, 0.58);
}());


/* ── 2. About-grid: element-level timeline ───────────────────────────────────
   Each .about-grid creates its own scroll-triggered timeline.
   Eyebrow → h2 → right column, each entering with a slight offset.
   Much cleaner than animating the whole column div as a block.
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
      start: 'top 86%',
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
    scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
  });
  if (num) tl.from(num, { autoAlpha: 0, y: 14, duration: 0.6  }, 0);
  if (h2)  tl.from(h2,  { autoAlpha: 0, y: 24, duration: 0.78 }, 0.16);
});


/* ── 4. Eyebrows — standalone (not already handled above) ───────────────── */
document.querySelectorAll('.eyebrow').forEach(function(el) {
  if (inside(el, MANAGED)) return;
  reveal(el, { autoAlpha: 0, y: 12, duration: 0.55, ease: 'power2.out' });
});


/* ── 5. H2 headings — standalone ────────────────────────────────────────── */
document.querySelectorAll('h2').forEach(function(el) {
  if (inside(el, MANAGED)) return;
  reveal(el, { autoAlpha: 0, y: 24, duration: 0.78, ease: 'power3.out' }, 'top 87%');
});


/* ── 6. HR rules — wipe in from left ────────────────────────────────────── */
document.querySelectorAll('hr').forEach(function(el) {
  reveal(
    el,
    { scaleX: 0, transformOrigin: 'left center', duration: 1.0, ease: 'power2.inOut' },
    'top 92%'
  );
});


/* ── 7. Pull quote ───────────────────────────────────────────────────────── */
document.querySelectorAll('.pull-quote').forEach(function(el) {
  reveal(el, { autoAlpha: 0, scale: 0.98, duration: 0.85, ease: 'power2.out' }, 'top 86%');
});


/* ── 8. Staggered groups ─────────────────────────────────────────────────── */

/* Feature cards — index.html, 3-col grid */
stagger('.feature-card',
  { autoAlpha: 0, y: 28, duration: 0.72, ease: 'power3.out' },
  0.08
);

/* Subject list — index.html */
stagger('.subject-list__item',
  { autoAlpha: 0, y: 16, duration: 0.60, ease: 'power2.out' },
  0.06
);

/* Process / options steps — sell.html + partner.html */
stagger('.process-step',
  { autoAlpha: 0, y: 24, duration: 0.68, ease: 'power3.out' },
  0.11
);

/* Contact options — contact.html */
stagger('.contact-option',
  { autoAlpha: 0, y: 22, duration: 0.65, ease: 'power2.out' },
  0.12
);

/* Shortcut cards — contact.html */
stagger('.shortcut-card',
  { autoAlpha: 0, y: 26, duration: 0.68, ease: 'power3.out' },
  0.09
);

/* Scope list — about.html */
stagger('.scope-list li',
  { autoAlpha: 0, y: 18, duration: 0.62, ease: 'power2.out' },
  0.09
);
