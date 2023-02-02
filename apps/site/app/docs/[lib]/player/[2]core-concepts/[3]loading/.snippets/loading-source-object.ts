const player = document.querySelector('media-player');

player.onAttach(async () => {
  // Audio
  const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  // If we don't set the `type` it will be passed to the video provider.
  player.src = [{ src: audioStream, type: 'audio/object' }];

  // Video
  const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
  player.src = videoStream;
});
