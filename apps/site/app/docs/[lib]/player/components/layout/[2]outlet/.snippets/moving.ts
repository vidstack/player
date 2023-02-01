const player = document.querySelector('media-player'),
  outlet = document.querySelector('media-outlet'),
  floatContainer = document.querySelector('.media-float-container'),
  floatButton = document.querySelector('.media-float-button');

outlet.onAttach(() => {
  let floating = false;
  floatButton.addEventListener('pointerup', () => {
    if (!floating) {
      floatContainer.append(outlet);
    } else {
      player.prepend(outlet);
    }
    floating = !floating;
  });
});
