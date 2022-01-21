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
  let cssProps = {};

  $: cssVarStyles = Object.entries(cssProps)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
</script>

<vds-slider
  style={cssVarStyles}
  use:spreadPropsAction={props}
  on:vds-slider-value-change={({ detail }) => {
    props.value = detail;
  }}
  on:vds-slider-drag-start={eventCallback}
  on:vds-slider-drag-end={eventCallback}
  on:vds-slider-value-change={throttledEventCallback(300)}
/>

<SliderControlsAddon
  {...props}
  on:change={({ detail: newProps }) => {
    props = newProps;
  }}
>
  <h2>CSS Properties</h2>

  <label>
    Thumb Width
    <input type="text" bind:value={cssProps['--vds-slider-thumb-width']} />
  </label>

  <label>
    Thumb Height
    <input type="text" bind:value={cssProps['--vds-slider-thumb-height']} />
  </label>

  <label>
    Thumb Background
    <input type="text" bind:value={cssProps['--vds-slider-thumb-bg']} />
  </label>

  <label>
    Thumb Border Radius
    <input
      type="text"
      bind:value={cssProps['--vds-slider-thumb-border-radius']}
    />
  </label>

  <label>
    Thumb Scale
    <input type="text" bind:value={cssProps['--vds-slider-thumb-scale']} />
  </label>

  <label>
    Track Height
    <input type="text" bind:value={cssProps['--vds-slider-track-height']} />
  </label>

  <label>
    Track Background
    <input type="text" bind:value={cssProps['--vds-slider-track-bg']} />
  </label>

  <label>
    Track Fill Background
    <input type="text" bind:value={cssProps['--vds-slider-track-fill-bg']} />
  </label>

  <label>
    Active Color
    <input type="text" bind:value={cssProps['--vds-slider-active-color']} />
  </label>

  <label>
    Disabled Color
    <input type="text" bind:value={cssProps['--vds-slider-disabled-color']} />
  </label>
</SliderControlsAddon>

<EventsAddon />

<style>
  vds-slider {
    width: 375px;
  }
</style>
