const provider = document.querySelector('vds-hls-video');

provider.addEventListener('instance', (event) => {
  const hlsjs = event.detail;
  // ...
});

provider.addEventListener('destroying', (event) => {
  // ...
});
