<script context="module">
  export const __pageMeta = {
    title: 'MediaTextElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';

  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { MediaTextElement } from './MediaTextElement';
  import { safelyDefineCustomElement } from '../../utils/dom';

  safelyDefineCustomElement('vds-media-text', MediaTextElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let value = 'currentTime';
  let currentTime = 0;
  let duration = 0;
  let bufferedAmount = 0;
  let seekableAmount = 0;
</script>

<vds-fake-media-provider
  emulate-currenttime={currentTime}
  emulate-duration={duration}
  emulate-bufferedamount={bufferedAmount}
  emulate-seekableamount={seekableAmount}
>
  <vds-media-text {value} />
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Media Text Value
    <input type="text" bind:value />
  </label>
  <label>
    Emulate Current Time
    <input type="number" bind:value={currentTime} />
  </label>
  <label>
    Emulate Duration
    <input type="number" bind:value={duration} />
  </label>
  <label>
    Emulate Buffered Amount
    <input type="number" bind:value={bufferedAmount} />
  </label>
  <label>
    Emulate Seekable Amount
    <input type="number" bind:value={seekableAmount} />
  </label>
</ControlsAddon>
