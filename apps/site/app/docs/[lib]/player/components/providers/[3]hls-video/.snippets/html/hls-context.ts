const provider = document.querySelector('vds-hls-video');
provider.onAttach(() => {
  // Refer to events to be notified when ctor or engine is defined.
  const { ctor, engine, supported, attached } = provider.hls;
});
