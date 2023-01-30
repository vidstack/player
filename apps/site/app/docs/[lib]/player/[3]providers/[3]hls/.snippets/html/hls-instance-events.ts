const player = document.querySelector('media-player');

player.addEventListener('hls-instance', (event) => {
  const hls = event.detail;
  // ...
});

player.addEventListener('hls-destroying', (event) => {
  // ...
});
