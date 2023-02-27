import { MediaMuteButton } from '@vidstack/react';

function MuteButton() {
  const tooltipId = 'media-mute-tooltip';

  return (
    <MediaMuteButton aria-describedby={tooltipId} defaultAppearance>
      <div id={tooltipId} role="tooltip" slot="tooltip-top-center">
        <span slot="mute-tooltip">Mute</span>
        <span slot="unmute-tooltip">Unmute</span>
      </div>
    </MediaMuteButton>
  );
}
