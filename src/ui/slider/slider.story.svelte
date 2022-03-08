<script context="module">
  export const __pageMeta = {
    title: 'SliderElement'
  };
</script>

<script>
  import {
    eventCallback,
    throttledEventCallback,
    EventsAddon
  } from '@vitebook/client/addons';
  import { safelyDefineCustomElement } from '../../utils/dom';

  import { spreadPropsAction } from '../../utils/svelte/actions';

  import { SliderElement } from './SliderElement';
  import SliderControlsAddon from './story-utils/SliderControlsAddon.svelte';

  safelyDefineCustomElement('vds-slider', SliderElement);

  let props = {};
</script>

<vds-slider
  use:spreadPropsAction={props}
  on:vds-slider-value-change={({ detail }) => {
    props.value = detail;
  }}
  on:vds-slider-drag-start={eventCallback}
  on:vds-slider-drag-end={eventCallback}
  on:vds-slider-drag-value-change={throttledEventCallback(300)}
  on:vds-slider-pointer-value-change={throttledEventCallback(300)}
  on:vds-slider-value-change={throttledEventCallback(300)}
>
  <div class="track" />
  <div class="track fill" />
  <div class="thumb-container">
    <div class="thumb" />
  </div>
</vds-slider>

<SliderControlsAddon
  {...props}
  on:change={({ detail: newProps }) => {
    props = newProps;
  }}
/>

<EventsAddon />

<style>
  vds-slider {
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
    max-width: 85%;
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
