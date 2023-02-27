import { MediaFullscreenButton } from '@vidstack/react';

function FullscreenButton() {
  const tooltipId = 'media-fullscreen-tooltip';

  return (
    <MediaFullscreenButton aria-describedby={tooltipId} defaultAppearance>
      <div id={tooltipId} role="tooltip" slot="tooltip-top-center">
        <span slot="enter-tooltip">Enter Fullscreen</span>
        <span slot="exit-tooltip">Exit Fullscreen</span>
      </div>
    </MediaFullscreenButton>
  );
}
