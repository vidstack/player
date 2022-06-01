const media = document.querySelector('vds-media');
const provider = document.querySelector('vds-video');

// 1. request is made.
media.addEventListener('vds-play–request', () => {
  console.log('play request was made.');
});

// 2. request is satisfied.
provider.addEventListener('vds-play', (event) => {
  // request events are attached to media events.
  const playRequestEvent = event.requestEvent;
  console.log('play request was satisfied.');
});

/**
 * This is roughly what `<vds-play-button>` would fire in
 * its click handler.
 */
function onPlayButtonClick(event: PointerEvent) {
  playButton.dispatchEvent(
    new VdsEvent('vds-play-request', {
      composed: true,
      bubbles: true,
      triggerEvent: event,
    }),
  );
}
