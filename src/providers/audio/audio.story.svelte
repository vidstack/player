<script context="module">
  export const __pageMeta = {
    title: 'AudioElement'
  };
</script>

<script>
  import {
    MediaControlsAddon,
    MediaEventsAddon,
    mediaStoreAction
  } from '../../media/story-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { spreadPropsAction } from '../../utils/svelte/actions';
  import { AudioElement } from './AudioElement';

  safelyDefineCustomElement('vds-audio', AudioElement);

  let mediaProvider;

  let mediaProps = {
    src: 'https://media-files.vidstack.io/audio.mp3',
    controls: true
  };
</script>

<vds-audio
  bind:this={mediaProvider}
  use:spreadPropsAction={mediaProps}
  use:mediaStoreAction={(newProps) => {
    mediaProps = { ...mediaProps, ...newProps };
  }}
/>

<MediaControlsAddon
  {...mediaProps}
  on:change={({ detail: newProps }) => {
    mediaProps = { ...mediaProps, ...newProps };
  }}
/>

<MediaEventsAddon {mediaProvider} />

<style>
  vds-audio {
    width: 375px;
  }
</style>
