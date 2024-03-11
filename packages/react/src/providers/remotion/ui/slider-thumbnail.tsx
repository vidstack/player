import * as React from 'react';

import { useMediaState } from '../../../hooks/use-media-state';
import { useSliderState } from '../../../hooks/use-slider-state';
import { isRemotionSrc } from '../type-check';
import RemotionThumbnail, { type RemotionThumbnailProps } from './thumbnail';

export interface RemotionSliderThumbnailProps extends Omit<RemotionThumbnailProps, 'frame'> {}

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/remotion/remotion-slider-thumbnail}
 * @example
 * ```tsx
 * <TimeSlider.Root>
 *   <TimeSlider.Preview>
 *     <RemotionSliderThumbnail />
 *   </TimeSlider.Preview>
 * </TimeSlider.Root>
 * ```
 */
const RemotionSliderThumbnail = React.forwardRef<HTMLElement, RemotionSliderThumbnailProps>(
  (props, ref) => {
    const $src = useMediaState('currentSrc'),
      $percent = useSliderState('pointerPercent');

    if (!isRemotionSrc($src)) return null;

    return (
      <RemotionThumbnail
        {...props}
        frame={$src.durationInFrames * ($percent / 100)}
        ref={ref}
        data-remotion-slider-thumbnail
      />
    );
  },
);

RemotionSliderThumbnail.displayName = 'RemotionSliderThumbnail';

export default RemotionSliderThumbnail;
