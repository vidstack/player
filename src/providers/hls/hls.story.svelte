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

  const src =
    'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8.m3u8';
  const poster = 'https://media-files.vidstack.io/poster.png';

  let mediaProps = {
    src,
    poster,
    controls: true
  };
</script>

<Variant name="With Controls">
  <vds-hls
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
</Variant>

<Variant name="Dynamic Import">
  <vds-hls {...mediaProps} hls-library={() => import('hls.js')} />
</Variant>

<Variant name="Source Element">
  <vds-hls {poster} controls loading="lazy">
    <source {src} type="application/vnd.apple.mpegURL" />
  </vds-hls>
</Variant>

<Variant name="Lazy Autoplay">
  <vds-hls {src} {poster} autoplay controls loading="lazy" />
</Variant>

<Variant name="Lazy CDN">
  <div
    style="display: flex; flex-direction: column; align-items: center; width: 100%;"
  >
    <vds-hls {poster} controls loading="lazy" style="margin: 100vh 0;">
      <source {src} type="application/vnd.apple.mpegURL" />
    </vds-hls>
    {#each Array(10).fill(0) as _}
      <vds-hls
        {src}
        {poster}
        controls
        loading="lazy"
        style="margin: 100vh 0;"
      />
    {/each}
  </div>
</Variant>

<Variant name="Lazy Imports">
  <div
    style="display: flex; flex-direction: column; align-items: center; width: 100%;"
  >
    <vds-hls
      {poster}
      controls
      loading="lazy"
      hls-library={() => import('hls.js')}
      style="margin: 100vh 0;"
    >
      <source {src} type="application/vnd.apple.mpegURL" />
    </vds-hls>
    {#each Array(10).fill(0) as _}
      <vds-hls
        {src}
        {poster}
        controls
        loading="lazy"
        hls-library={() => import('hls.js')}
        style="margin: 100vh 0;"
      />
    {/each}
  </div>
</Variant>

<style>
  vds-hls {
    max-width: 85%;
  }
</style>
