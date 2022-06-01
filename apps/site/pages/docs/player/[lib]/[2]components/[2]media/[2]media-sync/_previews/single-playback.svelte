<script>
  import { Media, MediaSync, Video, AspectRatio } from '@vidstack/player/svelte';
</script>

<div class="flex flex-col">
  <div class="media flex flex-col items-center">
    <Media class="w-full max-w-xs">
      <MediaSync singlePlayback>
        <AspectRatio ratio="16/9">
          <Video controls>
            <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4">
              <track kind="captions" />
            </video>
          </Video>
        </AspectRatio>
      </MediaSync>
    </Media>

    <Media class="w-full max-w-xs mt-2">
      <MediaSync singlePlayback>
        <AspectRatio ratio="16/9">
          <Video controls>
            <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4">
              <track kind="captions" />
            </video>
          </Video>
        </AspectRatio>
      </MediaSync>
    </Media>
  </div>

  <p class="mt-4 text-center text-xs">
    Press play on any video and then trying playing the other one.
  </p>
</div>
