<media-player
  class="w-full max-w-xs relative"
  volume={0.1}
  src="https://stream.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM.m3u8"
  playsinline={true}
  autoplay={true}
  aspect-ratio="16/9"
  stream-type="ll-live"
>
  <media-outlet>
    <media-buffering-indicator />
  </media-outlet>
  <div class="w-full text-center flex">
    <media-play-button class="live-play-button" />
    <media-time-slider />
    <media-live-indicator class="ml-2 mr-2" />
  </div>
</media-player>

<style>
  .live-play-button {
    min-width: 48px;
    min-height: 48px;
  }
</style>
