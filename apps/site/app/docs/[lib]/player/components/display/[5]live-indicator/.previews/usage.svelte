<script>
  import '../../[4]buffering-indicator/.snippets/styling.css';
</script>

<media-player
  class="w-full max-w-xs relative"
  volume={0.2}
  src="https://stream.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM.m3u8"
  playsinline
  aspect-ratio="16/9"
>
  <media-outlet>
    <div class="media-buffering-container">
      <svg class="media-buffering-icon" fill="none" viewBox="0 0 120 120" aria-hidden="true">
        <circle
          class="media-buffering-track"
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          stroke-width="8"
        />
        <circle
          class="media-buffering-track-fill"
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          stroke-width="10"
          pathLength="100"
        />
      </svg>
    </div>
  </media-outlet>
  <div class="w-full text-center flex">
    <media-play-button />
    <media-time-slider />
    <media-live-indicator class="ml-2 mr-2" />
  </div>
</media-player>
