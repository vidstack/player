import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { MediaAnnouncerInstance } from './primitives/instances';
import { Primitive } from './primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * MediaAnnouncer
 * -----------------------------------------------------------------------------------------------*/

const MediaAnnouncerBridge = createReactComponent(MediaAnnouncerInstance, {
  events: ['onChange'],
});

export interface MediaAnnouncerProps extends ReactElementProps<MediaAnnouncerInstance> {
  ref?: React.Ref<HTMLElement>;
}

/**
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/announcer}
 * @example
 * ```tsx
 * <MediaAnnouncer />
 * ```
 */
const MediaAnnouncer = React.forwardRef<HTMLElement, MediaAnnouncerProps>(
  ({ style, children, ...props }, forwardRef) => {
    return (
      <MediaAnnouncerBridge {...(props as Omit<MediaAnnouncerProps, 'ref'>)}>
        {(props) => (
          <Primitive.div
            {...props}
            style={{ display: 'contents', ...style }}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.div>
        )}
      </MediaAnnouncerBridge>
    );
  },
);

MediaAnnouncer.displayName = 'MediaAnnouncer';
export { MediaAnnouncer };
