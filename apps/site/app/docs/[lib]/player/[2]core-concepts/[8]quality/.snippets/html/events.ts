const player = document.querySelector('media-player');

player.addEventListener('qualities-change', (event) => {
  const newQualities = event.detail; // `VideoQuality[]`
});

player.addEventListener('quality-change', (event) => {
  const currentQuality = event.detail; // `VideoQuality | null`
});
