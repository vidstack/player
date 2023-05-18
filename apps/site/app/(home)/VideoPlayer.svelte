<media-player
  class="hero-video overflow-hidden shadow-lg"
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
  poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/animated.webp?start=268&end=278&width=640"
  thumbnails="https://media-files.vidstack.io/sprite-fight/thumbnails.vtt"
  aspect-ratio="16/9"
  key-target="document"
  volume={0.2}
>
  <media-outlet>
    <media-poster
      alt="Girl walks into a campfire with sprite gnomes around her friend on a campfire in danger!"
    />
    <track src="/media/sprite-fight.vtt" label="English" srclang="en-US" kind="subtitles" default />
    <track
      src="https://media-files.vidstack.io/sprite-fight/chapters.vtt"
      srclang="en-US"
      kind="chapters"
      default
    />
    <media-gesture class="top-0 left-0 h-full w-full" event="pointerup" action="toggle:paused" />
    <media-gesture
      class="top-0 left-0 h-full w-full"
      event="dblpointerup"
      action="toggle:fullscreen"
    />
    <media-gesture class="top-0 left-0 z-10 h-full w-1/5" event="dblpointerup" action="seek:-10" />
    <media-gesture class="top-0 right-0 z-10 h-full w-1/5" event="dblpointerup" action="seek:10" />
  </media-outlet>
  <div
    class="z-0 bg-black/30 transition-opacity opacity-0 not-user-idle:opacity-100 pointer-events-none bg-blur absolute inset-0 w-full h-full"
  />
  <media-captions class="not-user-idle:bottom-[80px] transition-[bottom] duration-300 z-10" />
  <media-buffering-indicator />
  <div
    class="can-control:opacity-100 pointer-events-none absolute inset-0 z-10 flex h-full flex-col justify-between text-white opacity-0 transition-opacity duration-200 ease-linear"
  >
    <div
      class="absolute inset-0 z-50 pointer-events-none user-idle:pointer-events-auto user-idle:cursor-none"
    />

    <div class="flex items-center pointer-events-auto w-fill px-2 z-50">
      <div class="flex-1" />
      <media-menu position="bottom">
        <media-menu-button>
          <media-icon type="chapters" />
          <media-tooltip position="bottom right">Chapters</media-tooltip>
        </media-menu-button>
        <media-chapters-menu-items />
      </media-menu>
      <media-menu position="bottom">
        <media-menu-button>
          <media-icon type="settings" data-rotate />
          <media-tooltip position="bottom right">Settings</media-tooltip>
        </media-menu-button>
        <media-menu-items>
          <media-menu>
            <media-audio-menu-button />
            <media-audio-menu-items />
          </media-menu>
          <media-menu>
            <media-playback-rate-menu-button />
            <media-playback-rate-menu-items />
          </media-menu>
          <media-menu>
            <media-quality-menu-button />
            <media-quality-menu-items />
          </media-menu>
          <media-menu>
            <media-captions-menu-button />
            <media-captions-menu-items />
          </media-menu>
        </media-menu-items>
      </media-menu>
    </div>

    <div class="flex-1" />
    <div class="flex items-center pointer-events-auto w-full px-4 -mb-2 z-10">
      <media-time class="text-sm tracking-wide mr-1" type="current" />
      <media-time-slider>
        <div slot="preview">
          <div>
            <media-slider-thumbnail class="rounded-sm" />
            <div class="absolute bottom-8 w-full text-center" part="chapter-title" />
          </div>
          <media-slider-value class="rounded-sm mt-2" type="pointer" format="time" />
        </div>
      </media-time-slider>
      <media-time class="text-sm tracking-wide ml-1" type="current" remainder />
    </div>
    <div class="flex items-center pointer-events-auto w-full mb-1 z-20 px-0.5">
      <media-play-button default-appearance>
        <media-tooltip position="top left">
          <span slot="play">Play (k)</span>
          <span slot="pause">Pause (k)</span>
        </media-tooltip>
      </media-play-button>
      <media-mute-button class="-ml-1" default-appearance>
        <media-tooltip>
          <span slot="mute">Mute (m)</span>
          <span slot="unmute">Unmute (m)</span>
        </media-tooltip>
      </media-mute-button>
      <media-volume-slider class="max-w-[64px] -ml-1.5">
        <media-slider-value class="rounded-sm" type="pointer" format="percent" slot="preview" />
      </media-volume-slider>
      <div class="flex-1 text-center">Sprite Fight</div>
      <media-caption-button default-appearance>
        <media-tooltip>
          <span slot="on">Closed-Captions On (c)</span>
          <span slot="off">Closed-Captions Off (c)</span>
        </media-tooltip>
      </media-caption-button>
      <media-pip-button default-appearance>
        <media-tooltip>
          <span slot="enter">Enter PIP (i)</span>
          <span slot="exit">Exit PIP (i)</span>
        </media-tooltip>
      </media-pip-button>
      <media-fullscreen-button class="right-2" default-appearance>
        <media-tooltip position="top right">
          <span slot="enter">Enter Fullscreen (f)</span>
          <span slot="exit">Exit Fullscreen (f)</span>
        </media-tooltip>
      </media-fullscreen-button>
    </div>
  </div>
</media-player>

<style>
  media-player:not([data-fullscreen]) {
    max-width: 680px;
    aspect-ratio: 16 / 9;
    border-radius: 2px;
  }

  :global(.hero-video media-captions [part='cue']) {
    letter-spacing: 0.025em;
  }

  div[part='chapter-title'] {
    text-shadow: -1px -1px 0 #212121, 1px -1px 0 #212121, -1px 1px 0 #212121, 1px 1px 0 #212121;
  }
</style>
