<script context="module">
  export const __pageMeta = {
    title: 'SliderValueTextElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';

  import { safelyDefineCustomElement } from '../../utils/dom';
  import { SliderElement } from './SliderElement';
  import { SliderValueTextElement } from './SliderValueTextElement';

  safelyDefineCustomElement('vds-slider', SliderElement);
  safelyDefineCustomElement('vds-slider-value-text', SliderValueTextElement);

  let min = 0;
  let max = 100;
  let value = 50;

  let type = 'current';
  let format = '';
  let showHours = false;
  let padHours = false;
  let decimalPlaces = 2;
</script>

<vds-slider
  {min}
  {max}
  {value}
  on:vds-slider-value-change={({ detail }) => {
    value = detail;
  }}
>
  <div class="track" />
  <div class="track-fill" />
  <div class="thumb-container">
    <div class="thumb" />
  </div>

  <vds-slider-value-text
    {type}
    {format}
    decimal-places={decimalPlaces}
    show-hours={showHours ? showHours : null}
    pad-hours={padHours ? padHours : null}
  />
</vds-slider>

<ControlsAddon>
  <label>
    Type
    <select bind:value={type}>
      <option value="current">Current</option>
      <option value="pointer">Pointer</option>
    </select>
  </label>
  <label>
    Format
    <select bind:value={format}>
      <option value="">None</option>
      <option value="percent">Percent</option>
      <option value="time">Time</option>
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
    Decimal Places
    <input type="number" bind:value={decimalPlaces} />
  </label>
  <label>
    Slider Min
    <input type="number" bind:value={min} />
  </label>
  <label>
    Slider Max
    <input type="number" bind:value={max} />
  </label>
  <label>
    Slider Value
    <input type="number" bind:value />
  </label>
</ControlsAddon>

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

  vds-slider-value-text {
    position: absolute;
    top: -24px;
    right: 0;
  }
</style>
