const player = document.querySelector('media-player');

player.addEventListener('play', (event) => {
  const originEvent = event.originEvent; // E.g., PointerEvent
  if (originEvent?.isTrusted) {
    // user performed action
  }
});
