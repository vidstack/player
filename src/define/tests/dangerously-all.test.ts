import '../dangerously-all';

test('it should define all vds elements', () => {
  const elements = [
    'vds-aspect-ratio',
    'vds-audio-player',
    'vds-audio',
    'vds-buffering-indicator',
    'vds-controls',
    'vds-fake-media-player',
    'vds-fake-media-provider',
    'vds-fullscreen-button',
    'vds-hls-player',
    'vds-hls',
    'vds-media-controller',
    'vds-media-ui',
    'vds-media-sync',
    'vds-media-visibility',
    'vds-mute-button',
    'vds-play-button',
    'vds-scrim',
    'vds-scrubber-preview-time',
    'vds-scrubber-preview-video',
    'vds-scrubber-preview',
    'vds-scrubber',
    'vds-seekable-progress-bar',
    'vds-slider',
    'vds-time-current',
    'vds-time-duration',
    'vds-time-slider',
    'vds-time',
    'vds-toggle-button',
    'vds-video-player',
    'vds-video',
    'vds-volume-slider'
  ];

  elements.forEach((el) => {
    expect(window.customElements.get(el)).to.be.toBeDefined;

    expect(() => {
      document.createElement(el);
    }).to.not.throw;
  });
});
