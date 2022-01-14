<script context="module">
  export const __pageMeta = {
    title: 'MediaSyncElement'
  };
</script>

<script>
  import { AudioElement } from '../../providers/audio';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { MediaSyncElement } from './MediaSyncElement';

  safelyDefineCustomElement('vds-media-sync', MediaSyncElement);
  safelyDefineCustomElement('vds-audio', AudioElement);
</script>

<div class="container">
  {#each Array.from(Array(3)) as _}
    <vds-media-sync
      shared-playback
      shared-volume
      volume-storage-key="@vidstack/media-sync-story-volume"
    >
      <vds-audio src="https://media-files.vidstack.io/audio.mp3" controls />
    </vds-media-sync>
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }

  vds-media-sync {
    margin-top: 40px;
  }

  vds-audio {
    width: 375px;
  }
</style>
