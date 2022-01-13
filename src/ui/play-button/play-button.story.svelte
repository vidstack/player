<script context="module">
  export const __pageMeta = {
    title: 'PlayButtonElement'
  };
</script>

<script>
  import {
    ControlsAddon,
    EventsAddon,
    eventCallback
  } from '@vitebook/client/addons';
  import { PlayButtonElement } from './PlayButtonElement';
  import { FakeMediaPlayerElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';

  safelyDefineCustomElement('vds-play-button', PlayButtonElement);
  safelyDefineCustomElement('vds-fake-media-player', FakeMediaPlayerElement);

  let canPlay = true;
  let paused = true;
</script>

<vds-fake-media-player
  emulate-canplay={canPlay}
  emulate-paused={paused}
  on:vds-play={() => {
    paused = false;
  }}
  on:vds-pause={() => {
    paused = true;
  }}
>
  <div class="media-ui" slot="ui">
    <vds-play-button
      on:vds-play-request={eventCallback}
      on:vds-pause-request={eventCallback}
    >
      <span class="play">Play</span>
      <span class="pause">Pause</span>
    </vds-play-button>
  </div>
</vds-fake-media-player>

<ControlsAddon>
  <label>
    Emulate Can Play
    <input type="checkbox" bind:checked={canPlay} />
  </label>

  <label>
    Emulate Paused
    <input type="checkbox" bind:checked={paused} />
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

  vds-play-button {
    background-color: orange;
  }

  .play,
  .pause {
    color: black;
    position: absolute;
    display: inline-block;
    width: 100px;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 0;
    font-size: 24px;
    font-weight: bold;
    transition: opacity 0.1s ease-out;
  }

  :global(vds-play-button:not([media-paused]) .pause) {
    position: relative;
    opacity: 1;
    z-index: 1;
  }

  :global(vds-play-button[media-paused] .play) {
    position: relative;
    opacity: 1;
    z-index: 1;
  }
</style>
