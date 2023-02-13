player.addEventListener('loaded-metadata', (event) => {
  // Available on all media events!
  const target = event.trigger?.target;
  if (target instanceof HTMLAudioElement) {
    target; // HTMLAudioElement
  }
});
