<script>
  import { ControlsAddon } from '@vitebook/client/addons';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let label = undefined;
  export let min = 0;
  export let max = 100;
  export let value = 50;
  export let hidden = false;
  export let disabled = false;
  export let orientation = 'horizontal';
  export let step = 1;
  export let keyboardStep = 1;
  export let shiftKeyMultiplier = 5;

  $: dispatch('change', {
    label,
    min,
    max,
    hidden,
    disabled,
    value,
    orientation,
    step,
    keyboardStep,
    shiftKeyMultiplier
  });
</script>

<ControlsAddon>
  <label>
    Label
    <input type="text" bind:value={label} />
  </label>

  <label>
    Min
    <input type="number" bind:value={min} />
  </label>

  <label>
    Max
    <input type="number" bind:value={max} />
  </label>

  <label>
    Value
    <input type="number" bind:value />
  </label>

  <label>
    Hidden
    <input type="checkbox" bind:checked={hidden} />
  </label>

  <label>
    Disabled
    <input type="checkbox" bind:checked={disabled} />
  </label>

  <label>
    Orientation
    <select bind:value={orientation}>
      <option value="horizontal">Orientation</option>
      <option value="vertical">Veritcal</option>
    </select>
  </label>

  <label>
    Step
    <input type="number" bind:value={step} />
  </label>

  <label>
    KeyboardStep
    <input type="number" bind:value={keyboardStep} />
  </label>

  <label>
    Shift-Key Multiplier
    <input type="number" bind:value={shiftKeyMultiplier} />
  </label>

  <slot />
</ControlsAddon>
