const provider = document.querySelector('vds-video');

provider.addEventListener('vds-loaded-metadata', (event) => {
  // original media event (`loadedmetadata`) is still available.
  const originalMediaEvent = event.triggerEvent;

  // event detail contains goodies.
  const { currentSrc, duration, poster, mediaType } = event.detail;
});
