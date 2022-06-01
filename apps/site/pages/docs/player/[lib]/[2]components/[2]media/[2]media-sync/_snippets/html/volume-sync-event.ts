const mediaSync = document.querySelector('vds-media-sync');

mediaSync.addEventListener('vds-media-volume-sync', (event) => {
  const { muted, volume } = event.detail;
  // ...
});
