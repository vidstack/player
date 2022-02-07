<script context="module">
  export const __pageMeta = {
    title: 'MediaUiElement'
  };
</script>

<script lang="ts">
  import { ControlsAddon } from '@vitebook/client/addons';

  import { safelyDefineCustomElement } from '../../utils/dom';
  import { FakeMediaProviderElement } from '../test-utils';
  import { MediaUiElement } from './MediaUiElement';

  safelyDefineCustomElement('vds-media-ui', MediaUiElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let canPlay = true;
  let paused = true;
  let waiting = true;
  let currentTime = 0;
</script>

<div>
  <vds-fake-media-provider
    emulate-canplay={canPlay}
    emulate-paused={paused}
    emulate-waiting={waiting}
    emulate-currenttime={currentTime}
  >
    <vds-media-ui />
  </vds-fake-media-provider>

  <p>
    Toggle media properties in controls addon and check in devtools whether
    media attributes and CSS props are updating.
  </p>
</div>

<ControlsAddon>
  <label>
    Emulate Can Play
    <input type="checkbox" bind:checked={canPlay} />
  </label>

  <label>
    Emulate Paused
    <input type="checkbox" bind:checked={paused} />
  </label>

  <label>
    Emulate Waiting
    <input type="checkbox" bind:checked={waiting} />
  </label>

  <label>
    Emulate Current Time
    <input type="number" bind:value={currentTime} />
  </label>
</ControlsAddon>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  vds-fake-media-provider {
    width: 200px;
    height: 200px;
    background-color: green;
  }

  p {
    width: 100%;
    text-align: center;
    margin-top: 24px;
  }
</style>
