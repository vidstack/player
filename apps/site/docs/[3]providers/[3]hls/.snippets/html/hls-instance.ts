const player = document.querySelector('media-player');

player.addEventListener('provider-setup', (event) => {
  const provider = event.detail;
  if (provider?.type === 'hls') {
    provider.ctor; // `hls.js` constructor
    provider.instance; // `hls.js` instance
  }
});
