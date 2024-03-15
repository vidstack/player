import * as React from 'react';

import { useMediaState } from '../../../hooks/use-media-state';
import RemotionThumbnail, { type RemotionThumbnailProps } from './thumbnail';

export interface RemotionPosterProps extends RemotionThumbnailProps {}

/**
 * @attr data-visible - Whether poster should be shown.
 * @docs {@link https://www.vidstack.io/docs/player/components/remotion/remotion-poster}
 * @example
 * ```tsx
 * <MediaPlayer>
 *   <MediaProvider>
 *     <RemotionPoster frame={100} />
 *   </MediaProvider>
 * </MediaPlayer>
 * ```
 */
const RemotionPoster = React.forwardRef<HTMLElement, RemotionPosterProps>((props, ref) => {
  const $isVisible = !useMediaState('started');
  return (
    <RemotionThumbnail
      {...props}
      ref={ref}
      data-remotion-poster
      data-visible={$isVisible || null}
    />
  );
});

RemotionPoster.displayName = 'RemotionPoster';
export default RemotionPoster;
