<script context="module">
  export const __pageMeta = {
    title: 'ToggleButtonElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';

  import { safelyDefineCustomElement } from '../../utils/dom';
  import { ToggleButtonElement } from './ToggleButtonElement';

  safelyDefineCustomElement('vds-toggle-button', ToggleButtonElement);

  let pressed = false;
  let label = undefined;
  let disabled = false;
  let describedBy = undefined;
</script>

<vds-toggle-button
  {pressed}
  {label}
  {disabled}
  {describedBy}
  on:click={() => {
    pressed = !pressed;
  }}
>
  <div class="pressed">Pressed</div>
  <div class="not-pressed">Not Pressed</div>
</vds-toggle-button>

<ControlsAddon>
  <label>
    Pressed
    <input type="checkbox" bind:checked={pressed} />
  </label>

  <label>
    Disabled
    <input type="checkbox" bind:checked={disabled} />
  </label>

  <label>
    Label
    <input type="text" bind:value={label} />
  </label>

  <label>
    Described By
    <input type="text" bind:value={describedBy} />
  </label>
</ControlsAddon>

<style>
  vds-toggle-button[pressed] .pressed {
    display: none;
  }

  vds-toggle-button:not([pressed]) .not-pressed {
    display: none;
  }
</style>
