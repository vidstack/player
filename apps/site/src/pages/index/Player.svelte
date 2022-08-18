<script lang="ts">
  import './player.css';

  import { Media, Hls, Poster, MediaVisibility } from '@vidstack/player-svelte';
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import PlayerTimeSlider from './PlayerTimeSlider.svelte';
  import PlayerGestures from './PlayerGestures.svelte';
  import PlayerDesktopControls from './PlayerDesktopControls.svelte';
  import PlayerBufferingIndicator from './PlayerBufferingIndicator.svelte';
  import PlayerMobileControls from './PlayerMobileControls.svelte';

  let previewTime = 0,
    started = false,
    tiles: { start: number; x: number; y: number }[],
    tileX = 0,
    tileY = 0,
    previewImg: HTMLImageElement,
    previewWidth = 160,
    previewHeight = previewWidth / (16 / 9),
    previewImgScale = 1;

  const playbackIds = {
    agent: 'dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8',
    spriteFight: 'VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU',
    coffeeRun: 'JbI9PGj5P7sYrIpEgQ27XeILXEjNbAriX7rGI7xc2KE',
    dweeb: 'lExK1J7JD0100017Mzzho5cSs02k5vTacSLa3ycu8ecoDcQ',
  };

  const posterTimes = {
    agent: 202,
    spriteFight: 22,
    coffeeRun: 60,
    dweeb: 14,
  };

  const posterAlt = {
    agent: 'Agent 327 blowing flames with a hair dryer.',
    spriteFight: 'Young girl curiously looking at a peculiar mushroom and taking notes.',
    coffeRun: 'A woman with a mug of supercharged coffee sliding down a rooftop.',
    dweeb:
      'A silly tiny pink dinosaur eating a mouthful of lollies. It seems to be eating from a dog bowl.',
  };

  const titles = Object.keys(playbackIds);
  const currentTitle = titles[Math.floor(Math.random() * titles.length)];
  const playbackId = playbackIds[currentTitle];
  const posterTime = posterTimes[currentTitle];

  $: if (tiles) {
    let j = 0;
    while (j < tiles.length - 1 && previewTime >= tiles[j].start) j++;
    ({ x: tileX, y: tileY } = tiles[j]);
  }

  async function getStoryboardCoordinates() {
    const key = `vidstack::storyboard::${currentTitle}`;
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      const storyboard = await fetch(`https://image.mux.com/${playbackId}/storyboard.json`);
      const coordinates = await storyboard.json();
      localStorage.setItem(key, JSON.stringify(coordinates));
      return coordinates;
    }
  }

  function resizePreviewImage() {
    if (!previewImg) return;
    previewImg.style.width = `${previewImg.naturalWidth * previewImgScale}px`;
    previewImg.style.height = `${previewImg.naturalHeight * previewImgScale}px`;
  }

  onMount(async () => {
    const coordinates = await getStoryboardCoordinates();
    tiles = coordinates.tiles;
    previewImgScale = Math.max(
      previewWidth / coordinates['tile_width'],
      previewHeight / coordinates['tile_height'],
    );
    resizePreviewImage();
  });

  $: if (previewImg) {
    previewImg.style.transform = `translate(-${tileX * previewImgScale}px, -${
      tileY * previewImgScale
    }px)`;
  }
</script>

<div class="relative flex h-full w-full flex-col">
  <Media
    class="media relative h-auto w-full select-none overflow-hidden rounded-md text-white shadow-lg"
    style="aspect-ratio: 16 / 9;"
    fullscreen-orientation="landscape"
    {started}
    --media-preview-width={`${previewWidth}px`}
    --media-preview-height={`${previewHeight}px`}
  >
    <MediaVisibility exit-viewport="pause" intersection-threshold={1}>
      <Hls
        class="h-full w-full bg-none"
        muted
        volume={0.2}
        poster={`https://image.mux.com/${playbackId}/thumbnail.png?width=896&height=504&fit_mode=smartcrop&time=${posterTime}`}
      >
        <video
          class="h-full w-full select-none object-contain"
          preload="none"
          playsinline
          src={`https://stream.mux.com/${playbackId}.m3u8`}
          crossorigin="anonymous"
        >
          <track kind="captions" />
        </video>
      </Hls>
    </MediaVisibility>

    <!-- Scrim -->
    <div
      class="media-scrim pointer-events-none absolute bottom-0 left-0 z-0 h-full w-full select-none bg-black/30 opacity-0"
    />

    <!-- Media Controls -->
    <div
      class={clsx(
        'pointer-events-none visible absolute inset-0 z-30 h-full w-full opacity-100 transition-opacity duration-300 ease-out',
      )}
    >
      <div class="media-controls 768:pb-0 flex h-full w-full flex-col px-1 pb-2">
        <PlayerMobileControls />

        <div class="768:block hidden flex-1" />

        <div class="flex min-h-[48px] w-full items-center">
          <PlayerTimeSlider
            {playbackId}
            on:preview-time-update={(e) => {
              previewTime = e.detail;
            }}
            on:storyboard-load={(e) => {
              previewImg = e.detail;
              resizePreviewImage();
            }}
            on:drag-end={() => {
              started = true;
            }}
          />
        </div>

        <PlayerDesktopControls />
      </div>

      <PlayerGestures />
    </div>

    <Poster
      class="media-poster pointer-events-none absolute top-0 left-0 z-0 h-full w-full opacity-0"
      alt={posterAlt[currentTitle]}
    />

    <PlayerBufferingIndicator />
  </Media>

  <div class="text-soft mt-5 w-full text-center text-sm">
    ☝️
    <span class="992:hidden">Demo</span>
    <span class="992:inline-block hidden">Product demo</span>
    <span class="text-divider mx-1.5">|</span>
    🎥
    <span class="992:inline-block hidden">Streamed with</span>
    <a
      class="hover:text-inverse hover:border-inverse border-b-2"
      href="https://www.mux.com"
      target="_blank"
    >
      Mux
    </a>
    <span class="text-divider mx-1.5">|</span> 🎞️
    <span class="992:inline-block hidden">Content by</span>
    <a
      class="hover:text-inverse hover:border-inverse border-b-2"
      href="https://www.blender.org"
      target="_blank"
    >
      Blender Foundation
    </a>
  </div>
</div>
