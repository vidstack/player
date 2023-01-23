const provider = document.querySelector('vds-hls-video');

provider.addEventListener('manifest-loaded', (event) => {
  const levelLoadedData = event.detail;
  // ...
});
