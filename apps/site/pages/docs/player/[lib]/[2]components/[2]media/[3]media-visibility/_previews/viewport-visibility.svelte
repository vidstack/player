<script lang="ts">
  import { type MediaVisibilityChangeEvent } from '@vidstack/player';
  import { Media, MediaVisibility, Video, AspectRatio } from '@vidstack/player/svelte';

  import ArrowUpIcon from '~icons/ri/arrow-up-line';
  import ArrowDownIcon from '~icons/ri/arrow-down-line';

  function onMediaVisibilityChange(event: MediaVisibilityChangeEvent) {
    const { viewport } = event.detail;
    console.log(event);
    console.log('Viewport ->', viewport);
  }
</script>

<div class="flex w-full flex-col items-center">
  <div class="flex px-2">
    <p class="text-center text-sm">Scrolling down away from player will pause playback</p>
    <ArrowDownIcon class="ml-1 mt-0.5 animate-bounce" width="20" height="20" />
  </div>

  <Media class="w-full max-w-md mt-8">
    <MediaVisibility
      enterViewport="play"
      exitViewport="pause"
      intersectionThreshold={1}
      viewportEnterDelay={0}
      on:vds-media-visibility-change={onMediaVisibilityChange}
    >
      <AspectRatio ratio="16/9">
        <Video controls autoplay muted>
          <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4">
            <track kind="captions" />
          </video>
        </Video>
      </AspectRatio>
    </MediaVisibility>
  </Media>

  <div class="h-60" />

  <div class="mt-8 mb-4 flex px-2">
    <p class="text-center text-sm">Scrolling up to player will resume playback</p>
    <ArrowUpIcon class="ml-1 mt-0.5 animate-bounce" width="20" height="20" />
  </div>
</div>
