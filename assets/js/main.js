(function () {
  'use strict';

  const icons = {
    chevronStart: '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronEnd: '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  function initNavigation() {
    document.querySelectorAll('[data-nav-toggle]').forEach((navButton) => {
      const header = navButton.closest('.site-header');
      const nav = header ? header.querySelector('[data-nav]') : null;
      if (!nav) return;
      navButton.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        navButton.setAttribute('aria-expanded', String(isOpen));
      });
      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          nav.classList.remove('is-open');
          navButton.setAttribute('aria-expanded', 'false');
        });
      });
    });
  }

  function initGalleries() {
    document.querySelectorAll('[data-gallery]').forEach((gallery) => {
      const track = gallery.querySelector('[data-gallery-track]');
      const prev = gallery.querySelector('[data-gallery-prev]');
      const next = gallery.querySelector('[data-gallery-next]');
      const windowEl = gallery.querySelector('.gallery-window');
      let index = 0;

      if (prev) prev.innerHTML = icons.chevronStart;
      if (next) next.innerHTML = icons.chevronEnd;
      if (!track || !windowEl || !track.children.length) return;

      function visibleCount() {
        const item = track.children[0];
        const itemWidth = item.getBoundingClientRect().width || 260;
        const trackWidth = windowEl.getBoundingClientRect().width || 1;
        return Math.max(1, Math.floor(trackWidth / itemWidth));
      }

      function update() {
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
        const itemWidth = track.children[0].getBoundingClientRect().width + gap;
        const maxIndex = Math.max(0, track.children.length - visibleCount());
        index = Math.max(0, Math.min(index, maxIndex));
        track.style.transform = `translate3d(${-index * itemWidth}px, 0, 0)`;
        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index === maxIndex;
      }

      if (prev) prev.addEventListener('click', () => { index -= 1; update(); });
      if (next) next.addEventListener('click', () => { index += 1; update(); });
      let resizeTimer;
      window.addEventListener('resize', () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(update, 120); }, { passive: true });
      requestAnimationFrame(update);
    });
  }

  function initLightbox() {
    const clickableImages = document.querySelectorAll('.gallery-track img, .full-gallery-grid img, .polaroid-card img, .classic-hero-image img, .gallery-hero-photo img, .museum-hero img');
    if (!clickableImages.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `<button type="button" aria-label="סגירת תמונה">${icons.close}</button><img alt="" />`;
    document.body.appendChild(lightbox);
    const lightboxImage = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('button');

    clickableImages.forEach((image) => {
      image.addEventListener('click', () => {
        lightboxImage.src = image.dataset.full || image.currentSrc || image.src;
        lightboxImage.alt = image.alt || 'תמונה מוגדלת';
        lightbox.classList.add('is-open');
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightboxImage.removeAttribute('src');
    }

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });
  }

  function init() {
    initNavigation();
    initGalleries();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
