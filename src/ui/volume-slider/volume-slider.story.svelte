<script context="module">
  export const __pageMeta = {
    title: 'VolumeSliderElement'
  };
</script>

<script>
  import {
    ControlsAddon,
    EventsAddon,
    throttledEventCallback
  } from '@vitebook/client/addons';

  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { VolumeSliderElement } from './VolumeSliderElement';

  safelyDefineCustomElement('vds-volume-slider', VolumeSliderElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let volume = 0.5;
</script>

<vds-fake-media-provider
  emulate-canplay={true}
  emulate-volume={volume}
  on:vds-volume-change={({ detail }) => {
    volume = detail.volume;
  }}
>
  <vds-volume-slider on:vds-volume-change-request={throttledEventCallback(300)}>
    <div class="track" />
    <div class="track fill" />
    <div class="thumb-container">
      <div class="thumb" />
    </div>
  </vds-volume-slider>
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Emulate Volume
    <input type="number" min="0" max="1" step="0.01" bind:value={volume} />
  </label>
</ControlsAddon>

<EventsAddon />

<style>
  vds-fake-media-provider {
    width: 100%;
    max-width: 85%;
  }

  vds-volume-slider {
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
