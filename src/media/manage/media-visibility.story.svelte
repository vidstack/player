<script context="module">
  export const __pageMeta = {
    title: 'MediaVisibilityElement'
  };
</script>

<script>
  import { AudioElement } from '../../providers/audio';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { MediaVisibilityElement } from './MediaVisibilityElement';
  import { Variant } from '@vitebook/client';
  import { eventCallback, EventsAddon } from '@vitebook/client/addons';

  safelyDefineCustomElement('vds-media-visibility', MediaVisibilityElement);
  safelyDefineCustomElement('vds-audio', AudioElement);
</script>

<Variant name="Play/Pause">
  <div class="container">
    {#each Array.from(Array(5)) as _}
      <vds-media-visibility
        enter-viewport="play"
        exit-viewport="pause"
        enter-page="play"
        exit-page="pause"
        on:vds-media-visibility-change={eventCallback}
      >
        <vds-audio src="https://media-files.vidstack.io/audio.mp3" controls />
      </vds-media-visibility>
    {/each}
  </div>
</Variant>

<Variant name="Mute/Unmute">
  <div class="container">
    {#each Array.from(Array(5)) as _}
      <vds-media-visibility
        enter-viewport="unmute"
        exit-viewport="mute"
        enter-page="unmute"
        exit-page="mute"
        on:vds-media-visibility-change={eventCallback}
      >
        <vds-audio src="https://media-files.vidstack.io/audio.mp3" controls />
      </vds-media-visibility>
    {/each}
  </div>
</Variant>

<EventsAddon />

<style>
  .container {
    display: flex;
    flex-direction: column;
  }

  vds-media-visibility {
    margin-top: 100vh;
  }

  vds-media-visibility:first-child {
    margin-top: 40vh;
  }

  vds-audio {
    width: 375px;
  }
</style>
