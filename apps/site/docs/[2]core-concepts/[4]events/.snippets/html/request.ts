const player = document.querySelector('media-player');

// 1. request was made
player.addEventListener('media-play–request', () => {
  // ...
});

// 2. request succeeded
player.addEventListener('play', (event) => {
  // request events are attached to media events
  const playRequestEvent = event.request; // MediaPlayRequestEvent
});

// 2. request failed
player.addEventListener('play-fail', (event) => {
  // ...
});
