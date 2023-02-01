const player = document.querySelector('media-player');

player.onAttach(async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
  player.src = mediaStream;
});
