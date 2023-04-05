const player = document.querySelector('media-player');

// New text tracks need to be added after the source has changed.
player.addEventListener('source-change', (event) => {
  player.textTracks
    .add({
      src: '/media/subs/english.vtt',
      type: 'vtt',
      kind: 'subtitles',
      label: 'English',
      language: 'en-US',
      default: true,
    })
    .add({
      // ...
    });
});
