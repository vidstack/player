<script context="module">
  export const __pageMeta = {
    title: 'BufferingIndicatorElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';
  import { FakeMediaPlayerElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { BufferingIndicatorElement } from './BufferingIndicatorElement';

  safelyDefineCustomElement(
    'vds-buffering-indicator',
    BufferingIndicatorElement
  );

  safelyDefineCustomElement('vds-fake-media-player', FakeMediaPlayerElement);

  let waiting = true;
</script>

<vds-fake-media-player emulate-waiting={waiting}>
  <vds-buffering-indicator slot="ui">
    <div>Waiting</div>
  </vds-buffering-indicator>
</vds-fake-media-player>

<ControlsAddon>
  <label>
    Emulate Waiting
    <input type="checkbox" bind:checked={waiting} />
  </label>
</ControlsAddon>

<style global>
  vds-fake-media-player {
    height: 300px;
    aspect-ratio: 16 / 9;
  }

  :global(vds-buffering-indicator) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease-out;
    transition-delay: 250ms;
  }

  :global(vds-buffering-indicator[media-waiting]) {
    opacity: 1;
  }

  vds-buffering-indicator > div {
    font-size: 24px;
    font-weight: bold;
    color: white;
    padding: 0 8px;
  }
</style>
