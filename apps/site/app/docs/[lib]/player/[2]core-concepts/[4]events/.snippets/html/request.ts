const player = document.querySelector('media-player');

// 1. request is made.
player.addEventListener('media-play–request', () => {
  console.log('play request was made.');
});

// 2. request is satisfied.
player.addEventListener('play', (event) => {
  // request events are attached to media events.
  const playRequestEvent = event.request;
  console.log('play request was satisfied.');
});
