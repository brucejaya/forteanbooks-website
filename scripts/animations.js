/* ────────────────────────────────────────────────────────────────────────────
   Fortean Books -- GSAP page-load and scroll animations
   Included on display pages only: index, about, sell, partner, contact, info.
   NOT included on shop.html or book detail pages.
   ─────────────────────────────────────────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

/* Elements inside these containers are animated as part of the container's
   own sequence -- skip them from the generic individual handlers.            */
var HERO_CONTAINERS = '.hero-centered, .page-hero, .about-hero';
var SKIP_CONTAINERS = HERO_CONTAINERS + ', .about-grid, .section-head, .pull-quote';

function isSkipped(el, extra) {
  var sel = SKIP_CONTAINERS + (extra ? ', ' + extra : '');
  return !!el.closest(sel);
}

/* Single element fade-up tied to a scroll trigger */
function scrollReveal(el, vars, start) {
  gsap.from(el, Object.assign({}, vars, {
    scrollTrigger: {
      trigger: el,
      start:   start || 'top 88%',
      toggleActions: 'play none none none'
    }
  }));
}

/* Staggered reveal for a group via ScrollTrigger.batch --
   fires once per viewport entry, naturally grouping rows of a grid. */
function batchReveal(selector, vars, stagger) {
  if (!document.querySelector(selector)) return;
  ScrollTrigger.batch(selector, {
    start: 'top 88%',
    onEnter: function(batch) {
      gsap.from(batch, Object.assign({ stagger: stagger || 0.1 }, vars));
    }
  });
}


/* ── 1. Page-load hero intro ─────────────────────────────────────────────────
   Fires on DOMContentLoaded (no scroll trigger). Sequences the top-of-page
   section for both index.html (.hero-centered) and inner pages (.page-hero,
   .about-hero).
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
  var hero = document.querySelector('.hero-centered, .page-hero, .about-hero');
  if (!hero) return;

  var eyebrow = hero.querySelector('.eyebrow');
  var heading  = hero.querySelector('h1');
  var lead     = hero.querySelector('.lead');
  var cta      = hero.querySelector('.hero-centered__actions');

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 18, duration: 0.7  },  0.10);
  if (heading)  tl.from(heading,  { opacity: 0, y: 44, duration: 0.92 },  0.26);
  if (lead)     tl.from(lead,     { opacity: 0, y: 28, duration: 0.82 },  0.44);
  if (cta)      tl.from(cta,      { opacity: 0, y: 24, duration: 0.72 },  0.62);
}());


/* ── 2. About-grid columns ───────────────────────────────────────────────────
   Animates both columns of each .about-grid section as a staggered pair.
   Left col: heading block. Right col: body copy. Both fade up, left first.
   ─────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.about-grid').forEach(function(grid) {
  var cols = Array.from(grid.children);
  if (!cols.length) return;
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 86%',
    toggleActions: 'play none none none',
    onEnter: function() {
      gsap.from(cols, {
        opacity: 0, y: 36, duration: 0.9, ease: 'power3.out', stagger: 0.18
      });
    }
  });
});


/* ── 3. Eyebrows (standalone -- not inside animated containers) ──────────── */
document.querySelectorAll('.eyebrow').forEach(function(el) {
  if (isSkipped(el)) return;
  scrollReveal(el, { opacity: 0, y: 16, duration: 0.62, ease: 'power2.out' });
});


/* ── 4. H2 headings (standalone) ────────────────────────────────────────── */
document.querySelectorAll('h2').forEach(function(el) {
  if (isSkipped(el)) return;
  scrollReveal(el, { opacity: 0, y: 40, duration: 0.88, ease: 'power3.out' }, 'top 86%');
});


/* ── 5. HR rules -- wipe in from left ───────────────────────────────────── */
document.querySelectorAll('hr').forEach(function(el) {
  scrollReveal(
    el,
    { scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'power2.inOut' },
    'top 92%'
  );
});


/* ── 6. Section heads (.section-head: num label + h2) ────────────────────── */
document.querySelectorAll('.section-head').forEach(function(el) {
  var num = el.querySelector('.num');
  var h2  = el.querySelector('h2');
  ScrollTrigger.create({
    trigger: el,
    start: 'top 87%',
    toggleActions: 'play none none none',
    onEnter: function() {
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (num) tl.from(num, { opacity: 0, y: 18, duration: 0.65 }, 0);
      if (h2)  tl.from(h2,  { opacity: 0, y: 40, duration: 0.88 }, 0.16);
    }
  });
});


/* ── 7. Pull quote ───────────────────────────────────────────────────────── */
document.querySelectorAll('.pull-quote').forEach(function(el) {
  scrollReveal(
    el,
    { opacity: 0, scale: 0.97, duration: 0.9, ease: 'power2.out' },
    'top 85%'
  );
});


/* ── 8. Staggered card / list groups ────────────────────────────────────── */

/* Featured books -- index.html */
batchReveal('.feature-card',
  { opacity: 0, y: 44, duration: 0.82, ease: 'power3.out' },
  0.09
);

/* Subject list items -- index.html: slide in from left */
batchReveal('.subject-list__item',
  { opacity: 0, x: -20, duration: 0.65, ease: 'power2.out' },
  0.07
);

/* Process steps -- sell.html + partner.html */
batchReveal('.process-step',
  { opacity: 0, y: 40, duration: 0.78, ease: 'power3.out' },
  0.12
);

/* Contact options -- contact.html */
batchReveal('.contact-option',
  { opacity: 0, y: 40, duration: 0.78, ease: 'power3.out' },
  0.15
);

/* Shortcut cards -- contact.html */
batchReveal('.shortcut-card',
  { opacity: 0, y: 42, scale: 0.97, duration: 0.78, ease: 'power3.out' },
  0.10
);

/* Scope list items -- about.html */
batchReveal('.scope-list li',
  { opacity: 0, y: 30, duration: 0.72, ease: 'power2.out' },
  0.10
);
