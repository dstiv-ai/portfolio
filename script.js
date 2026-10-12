(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const toggle = document.getElementById('theme-toggle');
  const currentTheme = () => root.dataset.theme || (media.matches ? 'dark' : 'light');
  const labelTheme = () => {
    if (!toggle) return;
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.textContent = next === 'dark' ? 'Dark' : 'Light';
    toggle.setAttribute('aria-label', `Switch to ${next} mode`);
  };
  if (toggle) {
    toggle.addEventListener('click', () => {
      root.dataset.theme = currentTheme() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) { /* Theme still applies for this visit. */ }
      labelTheme();
    });
    media.addEventListener('change', labelTheme);
    labelTheme();
  }

  const dialog = document.getElementById('lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const caption = dialog.querySelector('.lightbox-caption');
  const title = dialog.querySelector('#lightbox-title');
  const container = dialog.querySelector('.lightbox-body');
  const closeButton = dialog.querySelector('.lightbox-close');
  let origin = null;
  let priorOverflow = '';
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      origin = link;
      const image = document.createElement('img');
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt || '';
      container.replaceChildren(image);
      const text = link.dataset.caption || 'Screenshot';
      caption.textContent = text;
      title.textContent = text;
      priorOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      closeButton.focus();
    });
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')];
    if (!controls.length) return;
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
    origin = null;
  });
})();
