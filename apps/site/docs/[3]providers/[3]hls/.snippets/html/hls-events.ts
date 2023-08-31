const player = document.querySelector('media-player');

player.addEventListener('hls-manifest-loaded', (event) => {
  const levelLoadedData = event.detail;
  // ...
});
