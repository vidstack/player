<script context="module">
  export const __pageMeta = {
    title: 'SeekableProgessBarElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';

  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { SeekableProgressBarElement } from './SeekableProgressBarElement';

  safelyDefineCustomElement(
    'vds-seekable-progress-bar',
    SeekableProgressBarElement
  );
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let seekableAmount = 1800;
  let duration = 3600;
</script>

<vds-fake-media-provider
  emulate-seekableamount={seekableAmount}
  emulate-duration={duration}
>
  <!-- Helps visually, not needed. -->
  <div class="track">
    <vds-seekable-progress-bar />
  </div>
</vds-fake-media-provider>

<ControlsAddon>
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
  vds-fake-media-provider {
    width: 100%;
  }

  .track {
    position: relative;
    width: 90%;
    margin: 0 auto;
    height: 2.5px;
    background-color: white;
  }

  vds-seekable-progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 90%;
    margin: 0 auto;
  }
</style>
