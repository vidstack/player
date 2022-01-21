<script context="module">
  export const __pageMeta = {
    title: 'AudioElement'
  };
</script>

<script>
  import { Variant } from '@vitebook/client';

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

<Variant name="Default">
  <vds-audio
    bind:this={mediaProvider}
    use:spreadPropsAction={mediaProps}
    use:mediaStoreAction={(newProps) => {
      mediaProps = { ...mediaProps, ...newProps };
    }}
  />
</Variant>

<Variant name="Lazy">
  <vds-audio
    loading-strategy="lazy"
    style="margin: 100vh 0;"
    bind:this={mediaProvider}
    use:spreadPropsAction={mediaProps}
    use:mediaStoreAction={(newProps) => {
      mediaProps = { ...mediaProps, ...newProps };
    }}
  />
</Variant>

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
