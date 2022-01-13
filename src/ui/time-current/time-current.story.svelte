<script context="module">
  export const __pageMeta = {
    title: 'TimeCurrentElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';
  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { TimeCurrentElement } from './TimeCurrentElement';

  safelyDefineCustomElement('vds-time-current', TimeCurrentElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let currentTime = 0;
</script>

<vds-fake-media-provider emulate-currenttime={currentTime}>
  <vds-time-current />
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Emulate Current Time
    <input type="number" min="0" step="1" max="7200" bind:value={currentTime} />
  </label>
</ControlsAddon>

<style>
  vds-time-current {
    font-size: 24px;
  }
</style>
