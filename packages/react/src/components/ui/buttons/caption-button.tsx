import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { CaptionButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * CaptionButton
 * -----------------------------------------------------------------------------------------------*/

const CaptionButtonBridge = createReactComponent(CaptionButtonInstance, {
  domEventsRegex: /^onMedia/,
});

export interface CaptionButtonProps
  extends ReactElementProps<CaptionButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button for toggling the showing state of the captions.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/caption-button}
 * @example
 * ```tsx
 * const track = useMediaState('textTrack'),
 *   isOn = track && isTrackCaptionKind(track);
 *
 * <CaptionButton>
 *   {isOn ? <OnIcon /> : <OffIcon />}
 * </CaptionButton>
 * ```
 */
const CaptionButton = React.forwardRef<HTMLButtonElement, CaptionButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <CaptionButtonBridge {...(props as Omit<CaptionButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </CaptionButtonBridge>
    );
  },
);

CaptionButton.displayName = 'CaptionButton';
export { CaptionButton };
