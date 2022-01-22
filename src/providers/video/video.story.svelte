<script context="module">
  export const __pageMeta = {
    title: 'VideoElement'
  };
</script>

<script>
  import { Variant } from '@vitebook/client';

  import '../../define/vds-video';
  import { MediaEventsAddon, mediaStoreAction } from '../../media/story-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { spreadPropsAction } from '../../utils/svelte/actions';
  import VideoControlsAddon from './story-utils/VideoControlsAddon.svelte';
  import { VideoElement } from './VideoElement';

  safelyDefineCustomElement('vds-video', VideoElement);

  let mediaProvider;
  let hasAddons = true;

  const src = 'https://media-files.vidstack.io/720p.mp4';
  const poster = 'https://media-files.vidstack.io/poster.png';

  let mediaProps = {
    src,
    poster,
    controls: true
  };
</script>

<Variant
  name="Default"
  on:enter={() => {
    hasAddons = true;
  }}
>
  <vds-video
    bind:this={mediaProvider}
    use:spreadPropsAction={mediaProps}
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
    <vds-video
      {src}
      {poster}
      controls
      loading-strategy="lazy"
      style="margin: 100vh 0;"
    />

    <vds-video
      {poster}
      controls
      loading-strategy="lazy"
      style="margin: 100vh 0;"
    >
      <source {src} type="video/mp4" />
    </vds-video>
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
  vds-video {
    max-width: 85%;
  }
</style>
