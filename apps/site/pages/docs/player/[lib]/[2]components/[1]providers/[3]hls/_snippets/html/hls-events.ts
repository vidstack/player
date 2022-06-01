const provider = document.querySelector('vds-hls');

provider.addEventListener('vds-hls-manifest-loaded', (event) => {
  const levelLoadedData = event.detail;
  // ...
});
