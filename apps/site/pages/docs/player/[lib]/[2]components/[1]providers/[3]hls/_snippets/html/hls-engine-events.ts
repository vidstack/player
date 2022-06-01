const provider = document.querySelector('vds-hls');

provider.addEventListener('vds-hls-instance', (event) => {
  const hlsjs = event.detail;
  // ...
});

provider.addEventListener('vds-hls-destroying', (event) => {
  // ...
});
