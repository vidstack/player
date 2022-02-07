<script context="module">
  export const __pageMeta = {
    title: 'ScrubberElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';

  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { ScrubberElement } from './ScrubberElement';

  safelyDefineCustomElement('vds-scrubber', ScrubberElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let currentTime = 0;
  let duration = 3600;
  let seekableAmount = 1800;
</script>

<vds-fake-media-provider
  emulate-canplay={true}
  emulate-currenttime={currentTime}
  emulate-duration={duration}
  emulate-seekableAmount={seekableAmount}
  on:vds-time-update={({ detail }) => {
    currentTime = detail;
  }}
>
  <vds-scrubber />
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Emulate Current Time
    <input type="number" min="0" max={duration} bind:value={currentTime} />
  </label>

  <label>
    Emulate Seekable Amount
    <input
      type="number"
      min="0"
      step="1"
      max={duration}
      bind:value={seekableAmount}
    />
  </label>

  <label>
    Emulate Duration
    <input type="number" min="0" step="1" bind:value={duration} />
  </label>
</ControlsAddon>

<style>
  vds-scrubber {
    width: 375px;
  }
</style>
