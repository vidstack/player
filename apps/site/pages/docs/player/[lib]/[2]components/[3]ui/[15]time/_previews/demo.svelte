<script>
  import { AspectRatio, Gesture, Media, Time, Video } from '@vidstack/player/svelte';
</script>

<Media class="w-full max-w-md">
  <AspectRatio ratio="16/9">
    <Video autoplay muted>
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </Video>
  </AspectRatio>

  <div
    class="media-times flex flex-col absolute top-0.5 left-0.5 p-1 text-sm text-white bg-black/30"
  >
    <div>Current: <Time type="current" /></div>
    <div>Seekable: <Time type="seekable" /></div>
    <div>Buffered: <Time type="buffered" /></div>
    <div>Duration: <Time type="duration" /></div>
    <div>Remaining: <Time type="current" remainder /></div>
  </div>

  <Gesture class="absolute inset-0 w-full h-full" action="toggle:paused" type="click" />
</Media>

<style>
  .media-times > div {
    display: flex;
    align-items: center;
  }

  .media-times > div:not(:first-child) {
    margin-top: 8px;
  }
</style>
