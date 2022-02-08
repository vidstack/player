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
  >
    <div class="track" />
    <div class="track-fill" />
    <div class="thumb-container">
      <div class="thumb" />
    </div>
  </vds-time-slider>
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
    display: flex;
    align-items: center;
    border: 0;
    cursor: pointer;
    outline: 0;
    position: relative;
    width: 375px;
    height: 48px;
  }

  .thumb-container {
    position: absolute;
    top: 0px;
    width: 20px;
    height: 100%;
    outline: 0;
    z-index: 1;
    transform: translateX(-50%);
    will-change: left;
    left: var(--vds-slider-fill-percent);
  }

  :global(vds-time-slider[dragging] .thumb-container) {
    left: var(--vds-slider-pointer-percent) !important;
  }

  .thumb {
    position: absolute;
    border: 0;
    top: 50%;
    left: 0px;
    width: 20px;
    height: 20px;
    outline: none;
    border-radius: 50%;
    cursor: pointer;
    transform: translateY(-50%) scale(0.75);
    transition: transform 100ms ease-out 0s;
    will-change: transform;
    background-color: #161616;
  }

  .track {
    z-index: 0;
    width: 100%;
    height: 12.5px;
    pointer-events: none;
    background-color: #fafafa;
  }

  .track-fill {
    z-index: 0;
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 12.5px;
    pointer-events: none;
    background: #3a3a3a;
    transform-origin: left center;
    transform: translate(0%, -50%) scaleX(var(--vds-slider-fill-rate));
    will-change: transform;
  }

  :global(vds-time-slider[dragging] .thumb) {
    border: 0;
    outline: 0;
    background-color: orange;
  }
</style>
