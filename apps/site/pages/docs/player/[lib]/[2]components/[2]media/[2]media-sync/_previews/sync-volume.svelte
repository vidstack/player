<script lang="ts">
  import { type MediaVolumeSyncEvent } from '@vidstack/player';
  import { Media, MediaSync, Video, AspectRatio } from '@vidstack/player/svelte';

  function onMediaVolumeSync(event: MediaVolumeSyncEvent) {
    const { volume, muted } = event.detail;
    console.log(event);
    console.log(`Synced volume to ->`, volume);
    console.log(`Synced muted to ->`, muted);
  }
</script>

<div class="flex flex-col">
  <div class="media flex flex-col items-center">
    <Media class="w-full max-w-xs">
      <MediaSync syncVolume on:vds-media-volume-sync={onMediaVolumeSync}>
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
      <MediaSync syncVolume>
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
    Change the volume of one of the players and observe the volume on the other. Try muting them as
    well. Finally, open your console to see the <code>vds-media-volume-sync</code> event fire as you
    make any volume changes.
  </p>
</div>
