const media = document.querySelector('vds-media');

media.onAttach(async () => {
  try {
    await media.enterFullscreen();
  } catch (e) {
    // This will generally throw if:
    // 1. Fullscreen API is not available.
    // 2. Or, the user has not interacted with the document yet.
  }

  // ...

  try {
    await media.exitFullscreen();
  } catch (e) {
    // This will generally throw if:
    // 1. Fullscreen API is not available.
  }
});
