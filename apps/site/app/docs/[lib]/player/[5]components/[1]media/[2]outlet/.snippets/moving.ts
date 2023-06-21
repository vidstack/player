const player = document.querySelector('media-player'),
  provider = document.querySelector('media-provider'),
  floatContainer = document.querySelector('.media-float-container'),
  floatButton = document.querySelector('.media-float-button');

provider.onAttach(() => {
  let floating = false;
  floatButton.addEventListener('pointerup', () => {
    if (!floating) {
      floatContainer.append(provider);
    } else {
      player.prepend(provider);
    }
    floating = !floating;
  });
});
