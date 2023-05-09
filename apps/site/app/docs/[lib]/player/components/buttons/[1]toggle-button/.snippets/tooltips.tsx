import { MediaToggleButton, MediaTooltip, ThumbsDownIcon, ThumbsUpIcon } from '@vidstack/react';

<MediaToggleButton>
  <ThumbsUpIcon slot="on" />
  <ThumbsDownIcon slot="off" />
  <MediaTooltip position="top center">
    <span slot="on">On</span>
    <span slot="off">Off</span>
  </MediaTooltip>
</MediaToggleButton>;
