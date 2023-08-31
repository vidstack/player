const player = document.querySelector('media-player');

player.onAttach(async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  // If we don't set the `type` it will be passed to the video provider.
  player.src = [{ src: mediaStream, type: 'audio/object' }];
});
