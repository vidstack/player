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
  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';

  safelyDefineCustomElement('vds-play-button', PlayButtonElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let canPlay = true;
  let paused = true;
</script>

<vds-fake-media-provider
  emulate-canplay={canPlay}
  emulate-paused={paused}
  on:vds-play={() => {
    paused = false;
  }}
  on:vds-pause={() => {
    paused = true;
  }}
>
  <vds-play-button
    on:vds-play-request={eventCallback}
    on:vds-pause-request={eventCallback}
  >
    <span class="play">Play</span>
    <span class="pause">Pause</span>
  </vds-play-button>
</vds-fake-media-provider>

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
  vds-play-button {
    display: flex;
    justify-content: center;
    min-width: 96px;
    background-color: orange;
  }

  .play,
  .pause {
    color: black;
    display: none;
    font-size: 24px;
  }

  :global(vds-play-button:not([media-paused]) .pause),
  :global(vds-play-button[media-paused] .play) {
    display: block;
  }
</style>
