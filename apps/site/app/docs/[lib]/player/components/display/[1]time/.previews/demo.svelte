<vds-media class="w-full max-w-md" playsinline autoplay muted>
  <vds-aspect-ratio ratio="16/9">
    <vds-video>
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </vds-video>
  </vds-aspect-ratio>

  <div
    class="media-times flex flex-col absolute top-0.5 left-0.5 p-1 text-sm text-white bg-black/50"
  >
    <div>Current: <vds-time type="current" /></div>
    <div>Seekable: <vds-time type="seekable" /></div>
    <div>Buffered: <vds-time type="buffered" /></div>
    <div>Duration: <vds-time type="duration" /></div>
    <div>Remaining: <vds-time type="current" remainder /></div>
  </div>

  <!-- <Gesture class="absolute inset-0 w-full h-full" action="toggle:paused" type="click" /> -->
</vds-media>

<style>
  .media-times > div {
    display: flex;
    align-items: center;
    font-weight: bold;
  }

  .media-times vds-time {
    font-size: 14px;
    margin-left: 4px;
  }

  .media-times > div:not(:first-child) {
    margin-top: 8px;
  }
</style>
