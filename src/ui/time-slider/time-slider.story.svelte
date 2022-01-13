<script context="module">
  export const __pageMeta = {
    title: 'TimeSliderElement'
  };
</script>

<script>
  import {
    ControlsAddon,
    eventCallback,
    EventsAddon
  } from '@vitebook/client/addons';
  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { TimeSliderElement } from './TimeSliderElement';

  safelyDefineCustomElement('vds-time-slider', TimeSliderElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let step = 0.25;
  let keyboardStep = 5;
  let shiftKeyMultiplier = 2;
  let pauseWhileDragging = false;
  let seekingRequestThrottle = 100;

  let currentTime = 0;
  let duration = 3600;
</script>

<vds-fake-media-provider
  emulate-canplay={true}
  emulate-currenttime={currentTime}
  emulate-duration={duration}
  on:vds-time-update={({ detail }) => {
    currentTime = detail;
  }}
>
  <vds-time-slider
    {step}
    {keyboardStep}
    {shiftKeyMultiplier}
    {pauseWhileDragging}
    {seekingRequestThrottle}
    on:vds-play-request={eventCallback}
    on:vds-pause-request={eventCallback}
    on:vds-seeking-request={eventCallback}
    on:vds-seek-request={eventCallback}
  />
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Step
    <input type="number" bind:value={step} />
  </label>

  <label>
    Keyboard Step
    <input type="number" bind:value={keyboardStep} />
  </label>

  <label>
    Shift-Key Multiplier
    <input type="number" bind:value={shiftKeyMultiplier} />
  </label>

  <label>
    Pause While Dragging
    <input type="checkbox" bind:checked={pauseWhileDragging} />
  </label>

  <label>
    Seeking Request Throttle
    <input type="number" bind:value={seekingRequestThrottle} />
  </label>

  <label>
    Emulate Current Time
    <input type="number" min="0" max={duration} bind:value={currentTime} />
  </label>

  <label>
    Emulate Duration
    <input type="number" min="0" step="1" bind:value={duration} />
  </label>
</ControlsAddon>

<EventsAddon />

<style>
  vds-time-slider {
    width: 375px;
  }
</style>
