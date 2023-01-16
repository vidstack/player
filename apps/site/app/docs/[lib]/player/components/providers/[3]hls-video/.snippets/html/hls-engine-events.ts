const provider = document.querySelector('vds-hls-video');

provider.addEventListener('hls-instance', (event) => {
  const hlsjs = event.detail;
  // ...
});

provider.addEventListener('hls-destroying', (event) => {
  // ...
});
