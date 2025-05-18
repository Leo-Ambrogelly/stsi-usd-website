document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');

  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return;

    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = link.href;
      }, 300);
    });
  });
});
