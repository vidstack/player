const player = document.querySelector('media-player');

player.onAttach(() => {
  player.subscribe(({ qualities, quality, autoQuality, canSetQuality }) => {
    // ...
  });
});
