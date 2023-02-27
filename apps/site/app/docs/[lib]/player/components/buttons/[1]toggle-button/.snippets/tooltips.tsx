import { MediaToggleButton, ThumbsDownIcon, ThumbsUpIcon } from '@vidstack/react';

function MyToggleButton() {
  const tooltipId = 'media-...-tooltip';

  return (
    <MediaToggleButton aria-describedby={tooltipId}>
      <ThumbsUpIcon slot="on" />
      <ThumbsDownIcon slot="off" />
      <div id={tooltipId} role="tooltip" slot="tooltip-top-center">
        <span slot="on-tooltip">On</span>
        <span slot="off-tooltip">Off</span>
      </div>
    </MediaToggleButton>
  );
}
