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
    <div class="track-fill" />
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
  vds-volume-slider {
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

  :global(vds-volume-slider[dragging] .thumb-container) {
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

  :global(vds-volume-slider[dragging] .thumb) {
    border: 0;
    outline: 0;
    background-color: orange;
  }
</style>
