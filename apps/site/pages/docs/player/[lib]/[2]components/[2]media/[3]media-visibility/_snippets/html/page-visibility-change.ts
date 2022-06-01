const mediaVisibility = document.querySelector('vds-media-visibility');

mediaVisibility.addEventListener('vds-media-visibility-change', (event) => {
  const { page } = event.detail;
  // state can be: 'active' | 'passive' | 'hidden'
  // visibility can be: 'visible' | 'hidden'
  const { state, visibility } = page;
  if (state === 'hidden') {
    // ...
  }
});
