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
  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';

  safelyDefineCustomElement('vds-mute-button', MuteButtonElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let canPlay = true;
  let muted = false;
</script>

<vds-fake-media-provider
  emulate-canplay={canPlay}
  emulate-muted={muted}
  on:vds-volume-change={(e) => {
    muted = e.detail.muted;
  }}
>
  <vds-mute-button
    on:vds-mute-request={eventCallback}
    on:vds-unmute-request={eventCallback}
  >
    <span class="muted">Mute</span>
    <span class="unmuted">Unmute</span>
  </vds-mute-button>
</vds-fake-media-provider>

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
  vds-mute-button {
    display: flex;
    justify-content: center;
    min-width: 108px;
    background-color: orange;
  }

  .muted,
  .unmuted {
    color: black;
    display: none;
    font-size: 24px;
  }

  :global(vds-mute-button:not([media-muted]) .muted),
  :global(vds-mute-button[media-muted] .unmuted) {
    display: block;
  }
</style>
