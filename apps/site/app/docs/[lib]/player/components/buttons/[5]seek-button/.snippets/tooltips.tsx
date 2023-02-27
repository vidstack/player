import { MediaSeekButton } from '@vidstack/react';

function SeekForwardButton() {
  const tooltipId = 'media-seek-forward-tooltip';

  return (
    <MediaSeekButton seconds="+30" aria-describedby={tooltipId} defaultAppearance>
      <div id={tooltipId} role="tooltip" slot="tooltip">
        <span>Seek +30s</span>
      </div>
    </MediaSeekButton>
  );
}
