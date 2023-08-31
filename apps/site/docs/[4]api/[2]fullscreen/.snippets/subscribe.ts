const player = document.querySelector('media-player');

player.onAttach(() => {
  player.subscribe(({ canFullscreen, fullscreen }) => {
    // ...
  });
});
