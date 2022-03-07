<script context="module">
  export const __pageMeta = {
    title: 'AspectRatioElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { AspectRatioElement } from './AspectRatioElement';
  import { VideoElement } from '../../providers/video';

  safelyDefineCustomElement('vds-aspect-ratio', AspectRatioElement);
  safelyDefineCustomElement('vds-video', VideoElement);

  let minHeight = '150px';
  let maxHeight = '100vh';
  let ratio = '16 / 9';

  const src = 'https://media-files.vidstack.io/720p.mp4';
  const poster = 'https://media-files.vidstack.io/poster.png';
</script>

<vds-aspect-ratio min-height={minHeight} max-height={maxHeight} {ratio}>
  <vds-video {src} {poster} controls />
</vds-aspect-ratio>

<ControlsAddon>
  <label>
    Min Height
    <input type="text" bind:value={minHeight} />
  </label>

  <label>
    Max Height
    <input type="text" bind:value={maxHeight} />
  </label>

  <label>
    Aspect Ratio
    <input type="text" bind:value={ratio} />
  </label>
</ControlsAddon>

<style>
  vds-aspect-ratio {
    max-width: 85%;
  }
</style>
