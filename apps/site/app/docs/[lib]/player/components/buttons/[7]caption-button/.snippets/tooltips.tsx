import { MediaCaptionButton } from '@vidstack/react';

function CaptionButton() {
  const tooltipId = 'media-caption-tooltip';

  return (
    <MediaCaptionButton aria-describedby={tooltipId} defaultAppearance>
      <div id={tooltipId} role="tooltip" slot="tooltip-top-center">
        <span slot="on-tooltip">Closed-Captions On</span>
        <span slot="off-tooltip">Closed-Captions Off</span>
      </div>
    </MediaCaptionButton>
  );
}
