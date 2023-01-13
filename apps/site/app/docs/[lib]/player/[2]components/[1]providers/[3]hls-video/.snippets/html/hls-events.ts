const provider = document.querySelector('vds-hls-video');

provider.addEventListener('hls-manifest-loaded', (event) => {
  const levelLoadedData = event.detail;
  // ...
});
