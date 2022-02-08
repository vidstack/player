<script context="module">
  export const __pageMeta = {
    title: 'TimeElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';

  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { TimeElement } from './TimeElement';
  import { safelyDefineCustomElement } from '../../utils/dom';

  safelyDefineCustomElement('vds-time', TimeElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let type = 'current';
  let currentTime = 0;
  let duration = 0;
  let bufferedAmount = 0;
  let seekableAmount = 0;
  let showHours = false;
  let padHours = false;
  let remainder = false;
</script>

<vds-fake-media-provider
  emulate-currenttime={currentTime}
  emulate-duration={duration}
  emulate-bufferedamount={bufferedAmount}
  emulate-seekableamount={seekableAmount}
>
  <vds-time
    {type}
    show-hours={showHours ? showHours : null}
    pad-hours={padHours ? padHours : null}
    {remainder}
  />
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Type
    <select bind:value={type}>
      <option value="current">Current</option>
      <option value="buffered">Buffered</option>
      <option value="duration">Duration</option>
      <option value="seekable">Seekable</option>
    </select>
  </label>
  <label>
    Show Hours
    <input type="checkbox" bind:checked={showHours} />
  </label>
  <label>
    Pad Hours
    <input type="checkbox" bind:checked={padHours} />
  </label>
  <label>
    Remainder
    <input type="checkbox" bind:checked={remainder} />
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
