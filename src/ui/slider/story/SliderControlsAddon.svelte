<script>
  import { ControlsAddon } from '@vitebook/client/addons';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let min = 0;
  export let max = 100;
  export let value = 50;
  export let disabled = false;
  export let step = 1;
  export let keyboardStep = 1;
  export let shiftKeyMultiplier = 5;

  $: dispatch('change', {
    min,
    max,
    disabled,
    value,
    step,
    keyboardStep,
    shiftKeyMultiplier
  });
</script>

<ControlsAddon>
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
    Disabled
    <input type="checkbox" bind:checked={disabled} />
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
