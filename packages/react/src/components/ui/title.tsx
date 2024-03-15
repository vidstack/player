import * as React from 'react';

import { useMediaState } from '../../hooks/use-media-state';
import { Primitive, type PrimitivePropsWithRef } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Title
 * -----------------------------------------------------------------------------------------------*/

export interface TitleProps extends PrimitivePropsWithRef<'span'> {}

/**
 * This component is used to load and display the current media title.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/title}
 * @example
 * ```tsx
 * <Title />
 * ```
 */
const Title = React.forwardRef<HTMLElement, TitleProps>(({ children, ...props }, forwardRef) => {
  const $title = useMediaState('title');
  return (
    <Primitive.span {...props} ref={forwardRef as React.Ref<any>}>
      {$title}
      {children}
    </Primitive.span>
  );
});

Title.displayName = 'Title';
export { Title };
