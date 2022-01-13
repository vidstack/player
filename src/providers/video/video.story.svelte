<script context="module">
  export const __pageMeta = {
    title: 'VideoElement'
  };
</script>

<script>
  import '../../define/vds-video';
  import { MediaEventsAddon, mediaStoreAction } from '../../media/story';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { spreadPropsAction } from '../../utils/story';
  import VideoControlsAddon from './story/VideoControlsAddon.svelte';
  import { VideoElement } from './VideoElement';

  safelyDefineCustomElement('vds-video', VideoElement);

  let mediaProvider;

  let mediaProps = {
    src: 'https://media-files.vidstack.io/720p.mp4',
    poster: 'https://media-files.vidstack.io/poster.png',
    controls: true
  };
</script>

<vds-video
  bind:this={mediaProvider}
  use:spreadPropsAction={mediaProps}
  use:mediaStoreAction={(newProps) => {
    mediaProps = { ...mediaProps, ...newProps };
  }}
/>

<VideoControlsAddon
  {...mediaProps}
  on:change={({ detail: newProps }) => {
    mediaProps = { ...mediaProps, ...newProps };
  }}
/>

<MediaEventsAddon {mediaProvider} />

<style>
  vds-video {
    max-width: 85%;
  }
</style>
