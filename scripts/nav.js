/* ── Snipcart locale: cart → basket ─────────────────────────────────────── */
document.addEventListener('snipcart.ready', function () {
  Snipcart.api.session.setLanguage('en', {
    'header.title_cart_summary': 'Basket summary',
    'actions.close_cart':        'Close basket',
    'actions.clear_cart':        'Clear basket',
    'cart.loading':              "We’re getting your basket ready…",
    'cart.empty':                'Your basket is empty.',
    'cart.view_detailed_cart':   'View detailed basket',
    'actions.back_to_store':     'Back to shop',
  });
});

/* ── Mobile nav ─────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  var burgerBtn = document.getElementById('burger-btn');
  var closeBtn  = document.getElementById('mobile-nav-close');
  var nav       = document.getElementById('mobile-nav');
  if (!burgerBtn || !nav) return;

  function openMenu() {
    nav.classList.add('is-open');
    nav.setAttribute('aria-hidden', 'false');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    nav.setAttribute('aria-hidden', 'true');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burgerBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  /* Close when any nav link is tapped */
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* Escape key closes */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}());
