import { MediaPlayButton } from '@vidstack/react';

function PlayButton() {
  const tooltipId = 'media-play-tooltip';

  return (
    <MediaPlayButton aria-describedby={tooltipId} defaultAppearance>
      <div id={tooltipId} role="tooltip" slot="tooltip-top-center">
        <span slot="play-tooltip">Play</span>
        <span slot="pause-tooltip">Pause</span>
      </div>
    </MediaPlayButton>
  );
}
