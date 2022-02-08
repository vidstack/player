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
  <div class="track-fill" />
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

  :global(vds-slider[dragging] .thumb-container) {
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

  vds-slider:focus-visible .thumb,
  :global(vds-slider.focus-visible .thumb),
  vds-slider:active .thumb,
  :global(vds-slider[dragging] .thumb) {
    border: 0;
    outline: 0;
    background-color: orange;
  }

  :global(vds-slider[disabled] .thumb) {
    background-color: #e0e0e0;
  }
</style>
