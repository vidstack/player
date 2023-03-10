import { MediaPIPButton } from '@vidstack/react';

function FullscreenButton() {
  const tooltipId = 'media-pip-tooltip';

  return (
    <MediaPIPButton aria-describedby={tooltipId} defaultAppearance>
      <div id={tooltipId} role="tooltip" slot="tooltip-top-center">
        <span slot="enter-tooltip">Enter PIP</span>
        <span slot="exit-tooltip">Exit PIP</span>
      </div>
    </MediaPIPButton>
  );
}
