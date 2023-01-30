import HLS from 'hls.js';

const player = document.querySelector('media-player');

player.addEventListener('provider-change', (event) => {
  const provider = event.detail;
  if (provider?.type === 'hls') {
    // Static import
    provider.library = HLS;
    // Or, dynamic import
    provider.library = () => import('hls.js');
  }
});
