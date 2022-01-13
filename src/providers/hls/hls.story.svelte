<script context="module">
  export const __pageMeta = {
    title: 'HlsElement'
  };
</script>

<script>
  import '../../define/vds-hls';
  import { MediaEventsAddon, mediaStoreAction } from '../../media/story';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { spreadPropsAction } from '../../utils/story';
  import { VideoControlsAddon } from '../video/story';
  import { HlsElement } from './HlsElement';

  safelyDefineCustomElement('vds-hls', HlsElement);

  let mediaProvider;

  let mediaProps = {
    src: 'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8.m3u8',
    poster: 'https://media-files.vidstack.io/poster.png',
    controls: true
  };
</script>

<vds-hls
  bind:this={mediaProvider}
  hls-library="https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.js"
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
  vds-hls {
    max-width: 85%;
  }
</style>
