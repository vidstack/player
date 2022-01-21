<script context="module">
  export const __pageMeta = {
    title: 'TimeElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { spreadPropsAction } from '../../utils/svelte/actions';
  import { TimeElement } from './TimeElement';

  safelyDefineCustomElement('vds-time', TimeElement);

  let props = {};
</script>

<vds-time use:spreadPropsAction={props} />

<ControlsAddon>
  <label>
    Label
    <input type="text" bind:value={props.label} />
  </label>

  <label>
    Seconds
    <input type="number" step="1" bind:value={props.seconds} />
  </label>

  <label>
    Always Show Hours
    <input type="checkbox" bind:checked={props.alwaysShowHours} />
  </label>

  <label>
    Pad Hours
    <input type="checkbox" bind:checked={props.padHours} />
  </label>
</ControlsAddon>

<style>
  vds-time {
    font-size: 24px;
  }
</style>
