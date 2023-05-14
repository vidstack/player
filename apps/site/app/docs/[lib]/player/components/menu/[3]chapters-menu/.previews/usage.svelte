<script>
  let menu;

  function onAttached(event) {
    menu = event.target;
    menu.open(event);
  }

  function onPointerUp(event) {
    menu?.close(event);
  }

  function onWindowPointerUp(event) {
    event.stopImmediatePropagation();
  }

  function onPlayerConnect(event) {
    const player = event.target;
    player.$store.canLoad.set(true);
    player.$store.duration.set(231);
    player.setAttribute('data-can-play', '');
  }
</script>

<svelte:window on:pointerup={onWindowPointerUp} />

<media-player
  class="absolute top-0 left-0 w-full h-full flex items-end justify-center"
  thumbnails="https://media-files.vidstack.io/thumbnails.vtt"
  crossorigin="anonymous"
  on:pointerup|stopPropagation={onPointerUp}
  on:media-player-connect={onPlayerConnect}
>
  <media-outlet class="w-full h-full bg-none absolute top-0 left-0 opacity-0">
    <track src="https://media-files.vidstack.io/chapters.vtt" kind="chapters" default />
  </media-outlet>
  <media-menu class="mb-2" position="top right" on:attached={onAttached}>
    <media-menu-button aria-label="Chapters">
      <media-icon type="chapters" />
    </media-menu-button>
    <media-chapters-menu-items />
  </media-menu>
</media-player>
