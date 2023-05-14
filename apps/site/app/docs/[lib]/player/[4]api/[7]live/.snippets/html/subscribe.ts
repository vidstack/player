const player = document.querySelector('media-player');

player.onAttach(() => {
  player.subscribe(({ live, liveEdge, liveEdgeWindow }) => {
    // ...
  });
});
