<script context="module">
  export const __pageMeta = {
    title: 'FullscreenButtonElement'
  };
</script>

<script>
  import {
    ControlsAddon,
    EventsAddon,
    eventCallback
  } from '@vitebook/client/addons';
  import { FullscreenButtonElement } from './FullscreenButtonElement';
  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';

  safelyDefineCustomElement('vds-fullscreen-button', FullscreenButtonElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let canPlay = true;
  let fullscreen = false;
  let canFullscreen = true;
</script>

<vds-fake-media-provider
  emulate-canplay={canPlay}
  emulate-fullscreen={fullscreen}
  emulate-canfullscreen={canFullscreen}
  on:vds-fullscreen-change={(e) => {
    fullscreen = e.detail;
  }}
>
  <vds-fullscreen-button
    on:vds-enter-fullscreen-request={eventCallback}
    on:vds-exit-fullscreen-request={eventCallback}
  >
    <span class="enter">Enter Fullscreen</span>
    <span class="exit">Exit Fullscreen</span>
  </vds-fullscreen-button>
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Emulate Can Play
    <input type="checkbox" bind:checked={canPlay} />
  </label>

  <label>
    Emulate Fullscreen
    <input type="checkbox" bind:checked={fullscreen} />
  </label>

  <label>
    Emulate Can Request Fullscreen
    <input type="checkbox" bind:checked={canFullscreen} />
  </label>
</ControlsAddon>

<EventsAddon />

<style global>
  vds-fake-media-provider {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  vds-fullscreen-button {
    display: flex;
    justify-content: center;
    min-width: 96px;
    border-radius: 2px;
    padding: 4px;
    background-color: white;
  }

  .enter,
  .exit {
    color: black;
    display: none;
    font-size: 24px;
  }

  :global(vds-fullscreen-button:not([media-fullscreen]) .enter),
  :global(vds-fullscreen-button[media-fullscreen] .exit) {
    display: block;
  }
</style>
