<script>
  import Split from 'split.js';
  import { onMount } from 'svelte';

  onMount(() => {
    Split(['#audio-split-0', '#audio-split-1'], {
      sizes: [100, 0],
      minSize: [375, 0],
      expandToMin: true,
    });
  });
</script>

<div class="flex w-full flex-row mt-6">
  <div id="audio-split-0">
    <div class="w-full grid items-center rounded-sm border border-border shadow-lg">
      <div class="bg-elevate p-2 border-b shadow-sm">
        <div class="w-full flex items-center relative py-1">
          <div class="w-2.5 h-2.5 rounded-full bg-[#EC6A5F]" />
          <div class="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F4BF50]" />
          <div class="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#61C454]" />
        </div>
      </div>
      <div class="py-20 px-4 w-full bg-[#fafafa]">
        <media-player
          src="https://media-files.vidstack.io/sprite-fight/audio.mp3"
          title="Sprite Fight"
          class="w-full not-prose"
          view-type="audio"
          volume={0.2}
          key-target="document"
          crossorigin=""
          style="--audio-brand: rgb(124 58 237);"
        >
          <media-outlet>
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
  <div id="audio-split-1" />
</div>

<style>
  media-player {
    width: 100%;
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
