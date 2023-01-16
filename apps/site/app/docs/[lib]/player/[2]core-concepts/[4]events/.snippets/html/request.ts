const media = document.querySelector('vds-media');
const provider = document.querySelector('vds-video');

// 1. request is made.
media.addEventListener('media-play–request', () => {
  console.log('play request was made.');
});

// 2. request is satisfied.
provider.addEventListener('play', (event) => {
  // request events are attached to media events.
  const playRequestEvent = event.request;
  console.log('play request was satisfied.');
});
