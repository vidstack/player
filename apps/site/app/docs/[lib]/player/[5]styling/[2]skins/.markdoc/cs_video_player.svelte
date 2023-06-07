<script>
  import Split from 'split.js';
  import { onMount } from 'svelte';

  onMount(() => {
    Split(['#video-split-0', '#video-split-1'], {
      sizes: [100, 0],
      minSize: [375, 0],
      expandToMin: true,
    });
  });
</script>

<div class="flex w-full flex-row mt-6">
  <div id="video-split-0">
    <div class="w-full grid items-center rounded-sm border border-border shadow-lg">
      <div class="bg-elevate p-2 border-b shadow-sm">
        <div class="w-full flex items-center relative py-1">
          <div class="w-2.5 h-2.5 rounded-full bg-[#EC6A5F]" />
          <div class="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F4BF50]" />
          <div class="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#61C454]" />
        </div>
      </div>
      <div class="py-8 px-4 w-full bg-[#fafafa]">
        <media-player
          title="Sprite Fight"
          class="w-full overflow-hidden shadow-lg not-prose"
          src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
          poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/animated.webp?start=268&end=278&width=640"
          thumbnails="https://media-files.vidstack.io/sprite-fight/thumbnails.vtt"
          aspect-ratio="16/9"
          key-target="document"
          crossorigin=""
          volume={0.2}
          style="--video-brand: rgb(251 113 133);"
        >
          <media-outlet>
            <media-poster
              alt="Girl walks into sprite gnomes around her friend on a campfire in danger!"
            />
            <track
              src="/media/sprite-fight.vtt"
              label="English"
              srclang="en-US"
              kind="subtitles"
              default
            />
            <track
              src="https://media-files.vidstack.io/sprite-fight/chapters.vtt"
              srclang="en-US"
              kind="chapters"
              default
            />
          </media-outlet>
          <media-community-skin />
        </media-player>
      </div>
    </div>
  </div>
  <div id="video-split-1" />
</div>

<style>
  media-player:not([data-fullscreen]) {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  media-player :global(media-time-slider media-slider-value) {
    margin-top: -4px;
  }

  :global(.gutter) {
    position: relative;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: 50%;
    cursor: col-resize;
  }

  :global(.gutter::after) {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 4px;
    margin-top: 8px;
    transform: translateY(-50%);
    width: 6px;
    height: 48px;
    background-color: #64748b99;
    border-radius: 9999px;
  }
</style>
