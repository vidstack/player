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
  <div class="track fill" />
  <div class="thumb-container">
    <div class="thumb" />
    <vds-slider-value-text
      {type}
      {format}
      decimal-places={decimalPlaces}
      show-hours={showHours ? showHours : null}
      pad-hours={padHours ? padHours : null}
    />
  </div>
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
    background-color: #fff;
    transform: translateY(-50%);
  }

  vds-slider-value-text {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -32px;
    left: -6px;
    width: calc(var(--thumb-width) + 12px);
    will-change: left;
    color: #000;
    border-radius: 2px;
    background-color: #fff;
  }
</style>
