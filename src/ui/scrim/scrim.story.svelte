<script context="module">
  export const __pageMeta = {
    title: 'ScrimElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { ScrimElement } from './ScrimElement';

  safelyDefineCustomElement('vds-scrim', ScrimElement);

  let direction = 'up';
</script>

<vds-scrim {direction} />

<ControlsAddon>
  <label>
    Gradient Direction
    <select bind:value={direction}>
      <option value="up">up</option>
      <option value="down">down</option>
    </select>
  </label>
</ControlsAddon>

<style>
  vds-scrim {
    width: 100%;
    max-width: 80%;
    padding: 1px;
    background-color: white;
  }
</style>
