const player = document.querySelector('media-player');

player.addEventListener('provider-setup', (event) => {
  const provider = event.detail;
  if (provider?.type === 'video') {
    provider.video; // `HTMLVideoElement`
  }
});
