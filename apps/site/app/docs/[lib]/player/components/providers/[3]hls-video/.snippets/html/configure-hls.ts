const provider = document.querySelector('vds-hls-video');
provider.onAttach(() => {
  provider.config = { lowLatencyMode: true };
});
