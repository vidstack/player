const player = document.querySelector('media-player');

player.addEventListener('audio-tracks-change', (event) => {
  const newTracks = event.detail; // `AudioTrack[]`
});

player.addEventListener('audio-track-change', (event) => {
  const currentTrack = event.detail; // `AudioTrack | null`
});
