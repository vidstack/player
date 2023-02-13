const player = document.createElement('media-player'),
  vodLayout = document.querySelector('#vod-layout'),
  liveLayout = document.querySelector('#live-layout');

// Static example, but you could update dynamically as desired.
player.innerHTML = getPlayerLayout({ live: true });

function getPlayerLayout({ live = false }) {
  return live ? cloneTemplate(liveLayout) : cloneTemplate(vodLayout);
}

function cloneTemplate(template) {
  return template.content.cloneNode(true);
}
