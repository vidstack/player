const media = document.querySelector('vds-media');

media.addEventListener('loaded-metadata', (event) => {
  // original media event (`loadedmetadata`) is still available.
  const originalMediaEvent = event.trigger;
});
