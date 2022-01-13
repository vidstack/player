<script context="module">
  export const __pageMeta = {
    title: 'MuteButtonElement'
  };
</script>

<script>
  import {
    ControlsAddon,
    eventCallback,
    EventsAddon
  } from '@vitebook/client/addons';
  import { MuteButtonElement } from './MuteButtonElement';
  import { FakeMediaPlayerElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';

  safelyDefineCustomElement('vds-mute-button', MuteButtonElement);
  safelyDefineCustomElement('vds-fake-media-player', FakeMediaPlayerElement);

  let canPlay = true;
  let muted = false;
</script>

<vds-fake-media-player
  emulate-canplay={canPlay}
  emulate-muted={muted}
  on:vds-volume-change={(e) => {
    muted = e.detail.muted;
  }}
>
  <div class="media-ui" slot="ui">
    <vds-mute-button
      on:vds-mute-request={eventCallback}
      on:vds-unmute-request={eventCallback}
    >
      <span class="muted">MUTED</span>
      <span class="unmuted">UNMUTED</span>
    </vds-mute-button>
  </div>
</vds-fake-media-player>

<ControlsAddon>
  <label>
    Emulate Can Play
    <input type="checkbox" bind:checked={canPlay} />
  </label>

  <label>
    Emulate Muted
    <input type="checkbox" bind:checked={muted} />
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

  vds-mute-button {
    background-color: orange;
  }

  .muted,
  .unmuted {
    color: black;
    position: absolute;
    display: inline-block;
    width: 132px;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 0;
    font-size: 24px;
    font-weight: bold;
    transition: opacity 0.1s ease-out;
  }

  :global(vds-mute-button:not([media-muted]) .muted) {
    position: relative;
    opacity: 1;
    z-index: 1;
  }

  :global(vds-mute-button[media-muted] .unmuted) {
    position: relative;
    opacity: 1;
    z-index: 1;
  }
</style>
