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

  let step = 1;
  let keyboardStep = 1;
  let shiftKeyMultiplier = 5;
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
    keyboard-step={keyboardStep}
    shift-key-multiplier={shiftKeyMultiplier}
    pause-while-dragging={pauseWhileDragging ? pauseWhileDragging : null}
    seeking-request-throttle={seekingRequestThrottle}
    on:vds-play-request={eventCallback}
    on:vds-pause-request={eventCallback}
    on:vds-seeking-request={eventCallback}
    on:vds-seek-request={eventCallback}
  >
    <div class="track" />
    <div class="track fill" />
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
    <input
      type="number"
      min="0"
      max={duration}
      step="1"
      bind:value={currentTime}
    />
  </label>

  <label>
    Emulate Duration
    <input type="number" min="0" step="1" bind:value={duration} />
  </label>
</ControlsAddon>

<EventsAddon />

<style>
  vds-fake-media-provider {
    width: 100%;
    max-width: 85%;
  }

  vds-time-slider {
    --height: 48px;
    --thumb-width: 24px;
    --track-height: 4px;

    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    height: var(--height);
    width: 100%;
    /** Prevent thumb flowing out of slider. */
    margin: 0 calc(var(--thumb-width) / 2);
  }

  .track {
    background-color: #6366f1;
    width: 100%;
    height: var(--track-height);
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 0;
    transform: translateY(-50%);
  }

  .track.fill {
    background-color: #a5b4fc;
    transform-origin: left center;
    transform: translateY(-50%) scaleX(var(--vds-slider-fill-rate));
    will-change: transform;
    z-index: 1; /** above track. */
  }

  .thumb-container {
    position: absolute;
    top: 0;
    left: var(--vds-slider-fill-percent);
    width: var(--thumb-width);
    height: 100%;
    transform: translateX(-50%); /** re-center along x-axis. */
    z-index: 2; /** above track fill. */
    will-change: left;
  }

  :global([dragging] .thumb-container) {
    left: var(--vds-slider-pointer-percent);
  }

  .thumb {
    position: absolute;
    top: 50%;
    left: 0;
    width: var(--thumb-width);
    height: var(--thumb-width);
    border-radius: 9999px;
    cursor: pointer;
    background-color: #fff;
    transform: translateY(-50%);
  }
</style>
