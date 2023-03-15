const player = document.querySelector('media-player');

player.addEventListener('text-tracks-change', (event) => {
  const newTracks = event.detail; // `TextTrack[]`
});

player.addEventListener('text-track-change', (event) => {
  const currentTrack = event.detail; // `TextTrack | null`
});
