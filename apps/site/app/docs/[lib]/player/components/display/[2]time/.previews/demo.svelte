<script>
  function onAttach(e) {
    e.target.muted = true;
  }
</script>

<media-player
  src="https://media-files.vidstack.io/360p.mp4"
  class="w-full max-w-md"
  playsinline
  autoplay
  aspect-ratio="16/9"
  on:can-play={onAttach}
>
  <media-outlet />

  <div
    class="media-times flex flex-col absolute top-0.5 left-0.5 p-1 text-sm text-white bg-black/50"
  >
    <div>Current: <media-time type="current" /></div>
    <div>Buffered: <media-time type="buffered" /></div>
    <div>Duration: <media-time type="duration" /></div>
    <div>Remaining: <media-time type="current" remainder /></div>
  </div>
  <!-- <Gesture class="absolute inset-0 w-full h-full" action="toggle:paused" type="click" /> -->
</media-player>

<style>
  .media-times > div {
    display: flex;
    align-items: center;
    font-weight: bold;
  }

  .media-times media-time {
    font-size: 14px;
    margin-left: 4px;
  }

  .media-times > div:not(:first-child) {
    margin-top: 8px;
  }
</style>
