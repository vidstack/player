<media-player
  class="max-w-[680px] aspect-video hero-video rounded-sm overflow-hidden shadow-lg"
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
  poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/animated.webp?start=268&end=278&width=640"
  aspect-ratio="16/9"
  volume={0.2}
>
  <media-outlet>
    <track src="/media/sprite-fight.vtt" label="English" srclang="en" kind="subtitles" default />
  </media-outlet>
  <div
    class="z-0 bg-black/30 transition-opacity opacity-0 not-user-idle:opacity-100 pointer-events-none bg-blur absolute inset-0 w-full h-full"
  />
  <media-captions class="not-user-idle:bottom-[80px] transition-[bottom] duration-300 z-10" />
  <div
    class="pointer-events-none absolute inset-0 z-50 flex h-full w-full items-center justify-center"
  >
    <svg
      class="buffering:opacity-100 buffering:animate-spin h-24 w-24 opacity-0 text-white transition-opacity duration-200 ease-linear"
      fill="none"
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <circle
        class="opacity-25 blur-bg"
        cx="60"
        cy="60"
        r="54"
        stroke="currentColor"
        stroke-width="8"
      />
      <circle
        class="opacity-75"
        cx="60"
        cy="60"
        r="54"
        stroke="currentColor"
        stroke-width="10"
        pathLength="100"
        style="stroke-dasharray: 100; stroke-dashoffset: 50"
      />
    </svg>
  </div>
  <div
    class="can-control:opacity-100 pointer-events-none absolute inset-0 z-10 flex h-full flex-col justify-between text-white opacity-0 transition-opacity duration-200 ease-linear"
  >
    <div class="flex-1" />
    <div class="flex items-center pointer-events-auto w-full px-4 -mb-2 z-10">
      <media-time class="text-sm tracking-wide mr-1" type="current" />
      <media-time-slider style="--media-slider-preview-gap: 130px">
        <div slot="preview">
          <media-slider-thumbnail
            src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
            class="rounded-sm"
          />
          <media-slider-value class="rounded-sm" type="pointer" format="time" />
        </div>
      </media-time-slider>
      <media-time class="text-sm tracking-wide ml-1" type="current" remainder />
    </div>
    <div class="flex items-center pointer-events-auto w-full mb-1 z-20 px-0.5">
      <media-play-button aria-describedby="video-play-tooltip" default-appearance>
        <div class="left-2" id="video-play-tooltip" role="tooltip" slot="tooltip-top-left">
          <span slot="play-tooltip">Play (k)</span>
          <span slot="pause-tooltip">Pause (k)</span>
        </div>
      </media-play-button>
      <media-mute-button class="-ml-1" aria-describedby="video-mute-tooltip" default-appearance>
        <div id="video-mute-tooltip" role="tooltip" slot="tooltip-top-center">
          <span slot="mute-tooltip">Mute (m)</span>
          <span slot="unmute-tooltip">Unmute (m)</span>
        </div>
      </media-mute-button>
      <media-volume-slider class="max-w-[64px] -ml-1.5" style="--media-slider-preview-gap: 16px">
        <media-slider-value class="rounded-sm" type="pointer" format="percent" slot="preview" />
      </media-volume-slider>
      <div class="flex-1 text-center">Sprite Fight</div>
      <media-caption-button aria-describedby="video-caption-tooltip" default-appearance>
        <div id="video-caption-tooltip" role="tooltip" slot="tooltip-top-center">
          <span slot="on-tooltip">Closed-Captions On (c)</span>
          <span slot="off-tooltip">Closed-Captions Off (c)</span>
        </div>
      </media-caption-button>
      <media-pip-button aria-describedby="video-pip-tooltip" default-appearance>
        <div id="video-pip-tooltip" role="tooltip" slot="tooltip-top-center">
          <span slot="enter-tooltip">Enter PIP (i)</span>
          <span slot="exit-tooltip">Exit PIP (i)</span>
        </div>
      </media-pip-button>
      <media-fullscreen-button
        class="right-2"
        aria-describedby="video-fullscreen-tooltip"
        default-appearance
      >
        <div id="video-fullscreen-tooltip" role="tooltip" slot="tooltip-top-right">
          <span slot="enter-tooltip">Enter Fullscreen (f)</span>
          <span slot="exit-tooltip">Exit Fullscreen (f)</span>
        </div>
      </media-fullscreen-button>
    </div>
  </div>
</media-player>

<style>
  :global(.hero-video media-captions [part='cue']) {
    letter-spacing: 0.025em;
    border-radius: 2px;
    background-color: rgba(0 0 0 / 0.7);
    backdrop-filter: blur(8px);
  }

  :global(.hero-video [part='track']) {
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(2px);
  }

  :global(.hero-video [part*='track-progress']) {
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(2px);
  }

  :global(.hero-video [part='thumb']) {
    transition: box-shadow 0.15s ease;
  }

  :global(.hero-video media-volume-slider [part*='track-progress']) {
    display: none;
  }

  :global(.hero-video [data-media-button] [slot*='tooltip']) {
    bottom: 80%;
  }
</style>
