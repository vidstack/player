<vds-media class="w-full max-w-xs relative">
  <vds-aspect-ratio ratio="16/9">
    <vds-video volume={0.2} poster="https://media-files.vidstack.io/poster-2.png">
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </vds-video>

    <vds-poster alt="Agent 327 blowing flames with a hair dryer." />
  </vds-aspect-ratio>

  <div class="absolute bottom-0 left-0 flex w-full px-2 py-2">
    <vds-play-button />
    <div class="flex-1" />
    <vds-fullscreen-button />
  </div>
</vds-media>
