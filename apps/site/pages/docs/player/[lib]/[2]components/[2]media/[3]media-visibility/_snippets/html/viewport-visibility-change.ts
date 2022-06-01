const mediaVisibility = document.querySelector('vds-media-visibility');

mediaVisibility.addEventListener('vds-media-visibility-change', (event) => {
  const { viewport } = event.detail;
  if (viewport.isIntersecting) {
    // ...
  }
});
