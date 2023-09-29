const player = document.querySelector('media-player')!;

player.addEventListener('playing', (event) => {
  // the event that triggered the media play request
  const origin = event.originEvent; // e.g., PointerEvent

  // was this triggered by an actual person?
  const userPlayed = event.isOriginTrusted;

  // equivalent to above
  const isTrusted = event.originEvent?.isTrusted;
});
