<script context="module">
  export const __pageMeta = {
    title: 'HlsElement'
  };
</script>

<script>
  import { Variant } from '@vitebook/client';

  import '../../define/vds-hls';
  import { MediaEventsAddon, mediaStoreAction } from '../../media/story-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { spreadPropsAction } from '../../utils/svelte/actions';
  import { VideoControlsAddon } from '../video/story-utils';
  import { HlsElement } from './HlsElement';

  safelyDefineCustomElement('vds-hls', HlsElement);

  let mediaProvider;
  let hasAddons = true;

  const src =
    'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8.m3u8';
  const poster = 'https://media-files.vidstack.io/poster.png';
  const hlsLibCDN = 'https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.js';

  let mediaProps = {
    src,
    poster,
    controls: true
  };
</script>

<Variant
  name="CDN"
  on:enter={() => {
    hasAddons = true;
  }}
>
  <vds-hls
    hls-library={hlsLibCDN}
    bind:this={mediaProvider}
    use:spreadPropsAction={mediaProps}
    use:mediaStoreAction={(newProps) => {
      mediaProps = { ...mediaProps, ...newProps };
    }}
  />
</Variant>

<Variant
  name="Dynamic Import"
  on:enter={() => {
    hasAddons = true;
  }}
>
  <vds-hls
    bind:this={mediaProvider}
    use:spreadPropsAction={mediaProps}
    use:spreadPropsAction={{ hlsLibrary: () => import('hls.js') }}
    use:mediaStoreAction={(newProps) => {
      mediaProps = { ...mediaProps, ...newProps };
    }}
  />
</Variant>

<Variant
  name="Lazy"
  on:enter={() => {
    hasAddons = false;
  }}
>
  <div
    style="display: flex; flex-direction: column; align-items: center; width: 100%;"
  >
    <vds-hls
      {src}
      {poster}
      controls
      hls-library={hlsLibCDN}
      loading-strategy="lazy"
      style="margin: 100vh 0;"
    />

    <vds-hls
      {poster}
      controls
      hls-library={hlsLibCDN}
      loading-strategy="lazy"
      style="margin: 100vh 0;"
    >
      <source {src} type="application/vnd.apple.mpegURL" />
    </vds-hls>
  </div>
</Variant>

{#if hasAddons}
  <VideoControlsAddon
    {...mediaProps}
    on:change={({ detail: newProps }) => {
      mediaProps = { ...mediaProps, ...newProps };
    }}
  />

  <MediaEventsAddon {mediaProvider} />
{/if}

<style>
  vds-hls {
    max-width: 85%;
  }
</style>
