import { MediaToggleButton, MediaTooltip } from '@vidstack/react';
import { ThumbsDownIcon, ThumbsUpIcon } from '@vidstack/react/icons';

<MediaToggleButton>
  <ThumbsUpIcon slot="on" />
  <ThumbsDownIcon slot="off" />
  <MediaTooltip position="top center">
    <span slot="on">On</span>
    <span slot="off">Off</span>
  </MediaTooltip>
</MediaToggleButton>;
