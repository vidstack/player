const player = document.querySelector('media-player');

// 1. seeking started - can be fired more than once
player.addEventListener('media-seeking-request', (event) => {
  if (event.isOriginTrusted) {
    // user performed action
  }
});

// 2. seeking ended - fired once on end
player.addEventListener('media-seek-request', (event) => {
  if (event.isOriginTrusted) {
    // user performed action
  }
});
