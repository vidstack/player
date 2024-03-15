import * as React from 'react';

import { useChapterTitle } from '../../hooks/use-chapter-title';
import { Primitive, type PrimitivePropsWithRef } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Chapter Title
 * -----------------------------------------------------------------------------------------------*/

export interface ChapterTitleProps extends PrimitivePropsWithRef<'span'> {
  /**
   * Specify text to be displayed when no chapter title is available.
   */
  defaultText?: string;
}

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
  ({ defaultText = '', children, ...props }, forwardRef) => {
    const $chapterTitle = useChapterTitle();
    return (
      <Primitive.span {...props} ref={forwardRef as React.Ref<any>}>
        {$chapterTitle || defaultText}
        {children}
      </Primitive.span>
    );
  },
);

ChapterTitle.displayName = 'ChapterTitle';
export { ChapterTitle };
