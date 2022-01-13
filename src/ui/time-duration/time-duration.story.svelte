<script context="module">
  export const __pageMeta = {
    title: 'TimeDurationElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';
  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { TimeDurationElement } from './TimeDurationElement';

  safelyDefineCustomElement('vds-time-duration', TimeDurationElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let duration = 0;
</script>

<vds-fake-media-provider emulate-duration={duration}>
  <vds-time-duration />
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Emulate Duration
    <input type="number" min="0" step="1" max="7200" bind:value={duration} />
  </label>
</ControlsAddon>

<style>
  vds-time-duration {
    font-size: 24px;
  }
</style>
