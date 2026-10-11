(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const toggle = document.getElementById('theme-toggle');
  const currentTheme = () => root.dataset.theme || (media.matches ? 'dark' : 'light');
  const labelTheme = () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.textContent = next === 'dark' ? 'Dark' : 'Light';
    toggle.setAttribute('aria-label', `Switch to ${next} mode`);
  };
  toggle.addEventListener('click', () => {
    root.dataset.theme = currentTheme() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) { /* Theme works without storage. */ }
    labelTheme();
  });
  media.addEventListener('change', labelTheme);
  labelTheme();

  const dialog = document.getElementById('lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const caption = dialog.querySelector('.lightbox-caption');
  const container = dialog.querySelector('.lightbox-body');
  let origin = null;
  let priorOverflow = '';
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      origin = link;
      const image = document.createElement('img');
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      container.replaceChildren(image);
      caption.textContent = link.dataset.caption;
      priorOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      dialog.querySelector('.lightbox-close').focus();
    });
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = priorOverflow;
    origin?.focus({ preventScroll: true });
  });
})();
