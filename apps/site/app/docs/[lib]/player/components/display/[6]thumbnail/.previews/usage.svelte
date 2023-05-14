<script>
  function onConnect(event) {
    const player = event.target;
    player.$store.duration.set(231);
  }

  let time = 50;

  function onValueChange(event) {
    time = (event.detail / 100) * 231;
  }
</script>

<media-player
  class="w-full max-w-md relative"
  thumbnails="https://media-files.vidstack.io/thumbnails.vtt"
  on:media-player-connect={onConnect}
>
  <media-outlet />
  <div class="flex items-center justify-center">
    <media-thumbnail {time} />
  </div>
  <media-slider class="mt-4" on:value-change={onValueChange} />
</media-player>
