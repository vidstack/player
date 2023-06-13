<script>
  import { onMount } from 'svelte';

  let player;

  onMount(async () => {
    await customElements.whenDefined('media-player');
    player.onAttach(() => {
      player.textTracks.add({
        src: '/media/sprite-fight.vtt',
        kind: 'subtitles',
        language: 'en-US',
        label: 'English',
        default: true,
      });
    });
  });
</script>

<media-player
  class="w-full max-w-md relative bg-[unset] group"
  volume={0.2}
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
  poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.png?time=268&width=640"
  playsinline
  aspect-ratio="16/9"
  crossorigin=""
  bind:this={player}
>
  <media-outlet>
    <media-poster class="group-data-[started]:opacity-0" />
    <media-captions class="bottom-8 group-data-[user-idle]:bottom-0 transition-[bottom]" />
  </media-outlet>
  <div
    class="w-full text-center flex px-1 items-center absolute bottom-1 left-0 z-10 group-data-[user-idle]:opacity-0 transition-opacity"
  >
    <media-play-button class="min-w-[40px]" />
    <media-time-slider />
    <media-caption-button class="min-w-[40px]" />
  </div>
</media-player>
