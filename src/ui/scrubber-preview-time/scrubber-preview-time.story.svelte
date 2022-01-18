<script context="module">
  export const __pageMeta = {
    title: 'ScrubberPreviewTimeElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';

  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { ScrubberElement } from '../scrubber';
  import { ScrubberPreviewElement } from '../scrubber-preview';
  import { ScrubberPreviewTimeElement } from './ScrubberPreviewTimeElement';

  safelyDefineCustomElement('vds-scrubber', ScrubberElement);
  safelyDefineCustomElement('vds-scrubber-preview', ScrubberPreviewElement);
  safelyDefineCustomElement(
    'vds-scrubber-preview-time',
    ScrubberPreviewTimeElement
  );
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let currentTime = 0;
  let duration = 3600;
</script>

<vds-fake-media-provider
  emulate-currenttime={currentTime}
  emulate-duration={duration}
>
  <vds-scrubber>
    <vds-scrubber-preview>
      <vds-scrubber-preview-time />
    </vds-scrubber-preview>
  </vds-scrubber>
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Emulate Current Time
    <input type="number" min="0" max={duration} bind:value={currentTime} />
  </label>

  <label>
    Emulate Duration
    <input type="number" min="0" step="1" bind:value={duration} />
  </label>
</ControlsAddon>

<style>
  vds-scrubber {
    width: 375px;
  }

  vds-scrubber-preview-time {
    bottom: 24px;
    color: black;
    padding: 2px 4px;
    background-color: orange;
  }
</style>
