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
  import { FakeMediaPlayerElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';

  safelyDefineCustomElement('vds-fullscreen-button', FullscreenButtonElement);
  safelyDefineCustomElement('vds-fake-media-player', FakeMediaPlayerElement);

  let canPlay = true;
  let fullscreen = false;
  let canRequestFullscreen = true;
</script>

<vds-fake-media-player
  emulate-canplay={canPlay}
  emulate-fullscreen={fullscreen}
  emulate-canrequestfullscreen={canRequestFullscreen}
  on:vds-fullscreen-change={(e) => {
    fullscreen = e.detail;
  }}
>
  <div class="media-ui" slot="ui">
    <vds-fullscreen-button
      on:vds-enter-fullscreen-request={eventCallback}
      on:vds-exit-fullscreen-request={eventCallback}
    >
      <span class="enter">Enter Fullscreen</span>
      <span class="exit">Exit Fullscreen</span>
    </vds-fullscreen-button>
  </div>
</vds-fake-media-player>

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
    <input type="checkbox" bind:checked={canRequestFullscreen} />
  </label>
</ControlsAddon>

<EventsAddon />

<style global>
  vds-fake-media-player {
    height: 300px;
    aspect-ratio: 16 / 9;
  }

  .media-ui {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  vds-fullscreen-button {
    background-color: orange;
  }

  .enter,
  .exit {
    color: black;
    position: absolute;
    display: inline-block;
    width: 250px;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 0;
    font-size: 24px;
    font-weight: bold;
    transition: opacity 0.1s ease-out;
  }

  :global(vds-fullscreen-button:not([media-fullscreen]) .enter) {
    position: relative;
    opacity: 1;
    z-index: 1;
  }

  :global(vds-fullscreen-button[media-fullscreen] .exit) {
    position: relative;
    opacity: 1;
    z-index: 1;
  }
</style>
