<script context="module">
  export const __pageMeta = {
    title: 'VolumeSliderElement'
  };
</script>

<script>
  import {
    ControlsAddon,
    EventsAddon,
    throttledEventCallback
  } from '@vitebook/client/addons';

  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { VolumeSliderElement } from './VolumeSliderElement';

  safelyDefineCustomElement('vds-volume-slider', VolumeSliderElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let volume = 0.5;
</script>

<vds-fake-media-provider
  emulate-canplay={true}
  emulate-volume={volume}
  on:vds-volume-change={({ detail }) => {
    volume = detail.volume;
  }}
>
  <vds-volume-slider
    on:vds-volume-change-request={throttledEventCallback(300)}
  />
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Emulate Volume
    <input type="number" min="0" max="1" step="0.01" bind:value={volume} />
  </label>
</ControlsAddon>

<EventsAddon />

<style>
  vds-volume-slider {
    width: 375px;
  }
</style>
