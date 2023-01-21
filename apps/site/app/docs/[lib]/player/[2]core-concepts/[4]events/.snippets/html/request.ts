const media = document.querySelector('vds-media');

// 1. request is made.
media.addEventListener('media-play–request', () => {
  console.log('play request was made.');
});

// 2. request is satisfied.
media.addEventListener('play', (event) => {
  // request events are attached to media events.
  const playRequestEvent = event.request;
  console.log('play request was satisfied.');
});
