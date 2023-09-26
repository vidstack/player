import * as React from 'react';

import { createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { CaptionsInstance } from '../primitives/instances';
import { Primitive } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Captions
 * -----------------------------------------------------------------------------------------------*/

const CaptionsBridge = createReactComponent(CaptionsInstance);

export interface CaptionsProps extends ReactElementProps<CaptionsInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<CaptionsInstance>;
}

/**
 * Renders and displays captions/subtitles. This will be an overlay for video and a simple
 * captions box for audio.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/captions}
 * @example
 * ```tsx
 * <Captions />
 * ```
 */
const Captions = React.forwardRef<CaptionsInstance, CaptionsProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <CaptionsBridge {...props} ref={forwardRef}>
        {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
      </CaptionsBridge>
    );
  },
);

Captions.displayName = 'Captions';
export { Captions };
