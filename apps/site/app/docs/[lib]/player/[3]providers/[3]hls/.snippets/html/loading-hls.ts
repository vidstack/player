const player = document.querySelector('media-player');

player.addEventListener('provider-change', (event) => {
  const provider = event.detail;
  if (provider?.type === 'hls') {
    // Default development URL.
    provider.library = 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.js';
    // Default production URL.
    provider.library = 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js';
  }
});
