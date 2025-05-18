function headerComponent() {
  return {
    sideNav: false,
    isSearch: false,
    handleMenuLinkClick(event) {
      const link = event.target.closest('a[href]');
      if (!link) return;
      if (window.innerWidth >= 1024) return;
      if (link.target === '_blank') return;
      event.preventDefault();
      this.sideNav = false;
      setTimeout(() => {
        window.location.href = link.href;
      }, 300);
    }
  };
}

