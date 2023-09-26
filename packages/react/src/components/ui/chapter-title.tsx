import * as React from 'react';

import { useActiveTextCues } from '../../hooks/use-active-text-cues';
import { useActiveTextTrack } from '../../hooks/use-active-text-track';
import { useMediaState } from '../../hooks/use-media-state';
import { Primitive, type PrimitivePropsWithRef } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Chapter Title
 * -----------------------------------------------------------------------------------------------*/

export interface ChapterTitleProps extends PrimitivePropsWithRef<'span'> {}

/**
 * This component is used to load and display the current chapter title based on the text tracks
 * provided.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/chapter-title}
 * @example
 * ```tsx
 * <ChapterTitle />
 * ```
 */
const ChapterTitle = React.forwardRef<HTMLElement, ChapterTitleProps>(
  ({ children, ...props }, forwardRef) => {
    const $started = useMediaState('started'),
      $title = useMediaState('title'),
      track = useActiveTextTrack('chapters'),
      cues = useActiveTextCues(track);
    return (
      <Primitive.span {...props} ref={forwardRef as any}>
        {$started ? cues[0]?.text || $title : $title}
        {children}
      </Primitive.span>
    );
  },
);

ChapterTitle.displayName = 'ChapterTitle';
export { ChapterTitle };
