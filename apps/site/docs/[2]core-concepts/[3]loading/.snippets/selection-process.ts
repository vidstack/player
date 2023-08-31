const player = document.querySelector('media-player');

player.addEventListener('sources-change', (event) => {
  const newSources = event.detail;
});

player.addEventListener('source-change', (event) => {
  const newSource = event.detail;
});
