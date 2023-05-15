<script>
  let playing = false;

  function onPlaying() {
    playing = true;
  }

  function onPause() {
    playing = false;
  }
</script>

<div class="h-20 relative w-[120%] 1280:w-[110%]">
  <media-player
    class="rounded-md absolute z-50 top-0 -left-[20%] w-[120%] 1280:-left-[10%] 1280:w-[110%] h-full mb-1 mt-6 prefers-dark-scheme hero-audio bg-body border-border border-[1px]"
    src="https://media-files.vidstack.io/audio.mp3"
    view-type="audio"
    style="contain: layout"
    volume={0.2}
    key-target="document"
    on:playing={onPlaying}
    on:pause={onPause}
  >
    <media-outlet />
    <div
      class="flex items-center h-full opacity-0 can-play:opacity-100 pointer-events-auto z-10 px-2"
    >
      <div class="flex flex-1">
        <media-seek-button seconds="-10">
          <media-icon class="w-7 h-7" type="seek-backward-10" slot="backward" />
        </media-seek-button>
        <media-play-button class="-ml-1" />
        <media-seek-button class="-ml-1" seconds="10">
          <media-icon class="w-7 h-7" type="seek-forward-10" slot="forward" />
        </media-seek-button>
      </div>
      <div class="flex w-full flex-col items-center">
        <div class="flex items-center w-full max-w-xl px-4">
          <media-time class="text-sm mr-1 mt-2 tracking-wide text-white" type="current" />
          <media-time-slider step="0.1" class="-mb-2">
            <media-slider-value class="rounded-sm" type="pointer" format="time" slot="preview" />
          </media-time-slider>
          <media-time class="text-sm ml-1 mt-2 tracking-wide text-white" type="current" remainder />
        </div>
        <div class="flex items-center -translate-y-2">
          <media-mute-button class="w-10 h-10" />
          <div class="w-full text-center text-sm text-white">Tears of Steel - 40 Years Later</div>
        </div>
      </div>
      <div class="flex items-center px-2">
        <div class="sound-wave-container">
          <div class="sound-bar" class:animation={playing} />
          <div class="sound-bar large" class:animation={playing} />
          <div class="sound-bar" class:animation={playing} />
          <div class="sound-bar large" class:animation={playing} />
        </div>
      </div>
    </div>
  </media-player>
</div>

<style>
  .sound-wave-container {
    --size: 3.5px;
    --gutter: 2px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 28px;
    padding-bottom: 8px;
    border-radius: 2px;
    width: calc((var(--size) + var(--gutter)) * 4);
  }

  .sound-bar {
    width: var(--size);
    height: 80%;
    background: white;
    border-radius: 1px;
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }

  .sound-bar.animation {
    animation-name: sound-small;
  }

  .sound-bar.large {
    height: 60%;
  }

  .sound-bar.animation.large {
    animation-name: sound-large;
  }

  @keyframes sound-small {
    0% {
      height: 80%;
    }
    50% {
      height: 60%;
    }
    100% {
      height: 80%;
    }
  }

  @keyframes sound-large {
    0% {
      height: 60%;
    }
    50% {
      height: 90%;
    }
    100% {
      height: 60%;
    }
  }
</style>
