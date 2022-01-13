<script context="module">
  export const __pageMeta = {
    title: 'ScrubberPreviewVideoElement'
  };
</script>

<script>
  import { ControlsAddon } from '@vitebook/client/addons';

  import { FakeMediaProviderElement } from '../../media/test-utils';
  import { safelyDefineCustomElement } from '../../utils/dom';
  import { ScrubberElement } from '../scrubber';
  import { ScrubberPreviewElement } from '../scrubber-preview';
  import { ScrubberPreviewVideoElement } from './ScrubberPreviewVideoElement';

  safelyDefineCustomElement('vds-scrubber', ScrubberElement);
  safelyDefineCustomElement('vds-scrubber-preview', ScrubberPreviewElement);
  safelyDefineCustomElement(
    'vds-scrubber-preview-video',
    ScrubberPreviewVideoElement
  );
  safelyDefineCustomElement(
    'vds-fake-media-provider',
    FakeMediaProviderElement
  );

  let previewSrc = 'https://media-files.vidstack.io/240p.mp4';

  let currentTime = 0;
  let duration = 231;
</script>

<vds-fake-media-provider
  emulate-currenttime={currentTime}
  emulate-duration={duration}
>
  <vds-scrubber>
    <vds-scrubber-preview>
      <vds-scrubber-preview-video src={previewSrc} />
    </vds-scrubber-preview>
  </vds-scrubber>
</vds-fake-media-provider>

<ControlsAddon>
  <label>
    Preview Src
    <input type="text" bind:value={previewSrc} />
  </label>

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
  vds-fake-media-provider {
    width: 100%;
  }

  vds-scrubber {
    width: 90%;
    margin: 0 auto;
  }

  vds-scrubber-preview-video {
    bottom: 24px;
    color: black;
    padding: 2px 4px;
  }

  vds-scrubber-preview-video::part(video) {
    max-width: 250px;
  }
</style>
