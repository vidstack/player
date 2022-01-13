<script context="module">
  export const __pageMeta = {
    title: 'ScrubberPreviewElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';

  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { spreadPropsAction } from '../../utils/story';
  import { ScrubberElement } from '../scrubber';
  import { ScrubberPreviewElement } from './ScrubberPreviewElement';

  safelyDefineCustomElement('vds-scrubber', ScrubberElement);
  safelyDefineCustomElement('vds-scrubber-preview', ScrubberPreviewElement);
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let hidden = false;
  let disabled = false;
  let noTrackFill = false;
  let noClamp = false;

  let currentTime = 0;
  let duration = 3600;
  let seekableAmount = 1800;
</script>

<vds-fake-media-provider
  emulate-currenttime={currentTime}
  emulate-duration={duration}
  emulate-seekableAmount={seekableAmount}
>
  <vds-scrubber>
    <vds-scrubber-preview
      use:spreadPropsAction={{ hidden, disabled, noTrackFill, noClamp }}
    >
      <div class="preview">Preview</div>
    </vds-scrubber-preview>
  </vds-scrubber>
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Hidden
    <input type="checkbox" bind:checked={hidden} />
  </label>

  <label>
    Disabled
    <input type="checkbox" bind:checked={disabled} />
  </label>

  <label>
    No Track Fill
    <input type="checkbox" bind:checked={noTrackFill} />
  </label>

  <label>
    No Clamp
    <input type="checkbox" bind:checked={noClamp} />
  </label>

  <label>
    Emulate Current Time
    <input type="number" min="0" max={duration} bind:value={currentTime} />
  </label>

  <label>
    Emulate Seekable Amount
    <input
      type="number"
      min="0"
      step="1"
      max={duration}
      bind:value={seekableAmount}
    />
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

  .preview {
    padding: 2px 4px;
    bottom: 24px;
    background-color: orange;
  }
</style>
