const player = document.querySelector('media-player');

player.onAttach(() => {
  player.subscribe(({ audioTracks, audioTrack }) => {
    // ...
  });
});
