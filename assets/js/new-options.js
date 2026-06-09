(function () {
  'use strict';

  const svg = {
    menu: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.8 8.7c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function injectIcons() {
    document.querySelectorAll('[data-menu-icon]').forEach(el => { el.innerHTML = svg.menu; });
    document.querySelectorAll('[data-heart-icon]').forEach(el => { el.innerHTML = svg.heart; });
    document.querySelectorAll('[data-arrow-icon]').forEach(el => { el.innerHTML = svg.arrow; });
  }

  function initNav() {
    document.querySelectorAll('[data-nav-toggle]').forEach(button => {
      const nav = document.querySelector(button.getAttribute('aria-controls') ? '#' + button.getAttribute('aria-controls') : '[data-nav]');
      if (!nav) return;
      button.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(open));
      });
      nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      }));
    });
  }

  function initLightbox() {
    const images = document.querySelectorAll('[data-full]');
    if (!images.length) return;
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button type="button" aria-label="סגירת תמונה">' + svg.close + '</button><img alt="" />';
    document.body.appendChild(box);
    const boxImg = box.querySelector('img');
    const close = box.querySelector('button');

    images.forEach(img => {
      img.classList.add('clickable-photo');
      img.addEventListener('click', () => {
        boxImg.src = img.dataset.full || img.currentSrc || img.src;
        boxImg.alt = img.alt || 'תמונה מוגדלת';
        box.classList.add('is-open');
        close.focus({ preventScroll: true });
      });
    });

    function hide() {
      box.classList.remove('is-open');
      boxImg.removeAttribute('src');
    }
    close.addEventListener('click', hide);
    box.addEventListener('click', event => { if (event.target === box) hide(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && box.classList.contains('is-open')) hide(); });
  }

  function markActiveNav() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach(a => {
      const target = (a.getAttribute('href') || '').split('#')[0];
      if (target === current) a.classList.add('is-active');
    });
  }

  function init() {
    injectIcons();
    initNav();
    initLightbox();
    markActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
