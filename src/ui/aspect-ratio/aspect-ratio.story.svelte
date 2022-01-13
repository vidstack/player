<script context="module">
  export const __pageMeta = {
    title: 'AspectRatioElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { AspectRatioElement } from './AspectRatioElement';

  safelyDefineCustomElement('vds-aspect-ratio', AspectRatioElement);

  let minHeight = '150px';
  let maxHeight = '100vh';
  let ratio = '2:1';
</script>

<vds-aspect-ratio {minHeight} {maxHeight} {ratio}>
  <div />
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

  div {
    height: 100%;
    background-color: #000;
  }
</style>
