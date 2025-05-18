document.addEventListener('DOMContentLoaded', () => {
  const headerEl = document.querySelector('header[x-data]');
  if (!headerEl) return;
  const menuLinks = headerEl.querySelectorAll('.nav__menu a[href]');
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth >= 1024) return; // only for mobile/tablet
      const alpine = headerEl.__x;
      if (!alpine || !alpine.$data.sideNav) return;
      if (link.target === '_blank') return;
      e.preventDefault();
      alpine.$data.sideNav = false;
      setTimeout(() => {
        window.location.href = link.href;
      }, 300);
    });
  });
});
