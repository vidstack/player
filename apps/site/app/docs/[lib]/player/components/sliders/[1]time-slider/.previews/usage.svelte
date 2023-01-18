<vds-media class="w-full max-w-xs relative">
  <vds-aspect-ratio ratio="16/9">
    <vds-video volume={0.2} poster="https://media-files.vidstack.io/poster-2.png">
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </vds-video>

    <vds-poster alt="Agent 327 blowing flames with a hair dryer." />
  </vds-aspect-ratio>

  <div class="w-full text-center flex">
    <vds-play-button />
    <vds-time-slider />
  </div>
</vds-media>
