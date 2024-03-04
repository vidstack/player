import * as React from 'react';

import { createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { SpeedSliderInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';
import { sliderCallbacks } from './slider-callbacks';

/* -------------------------------------------------------------------------------------------------
 * SpeedSlider
 * -----------------------------------------------------------------------------------------------*/

const SpeedSliderBridge = createReactComponent(SpeedSliderInstance, {
  events: sliderCallbacks,
  domEventsRegex: /^onMedia/,
});

export interface RootProps extends ReactElementProps<SpeedSliderInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<SpeedSliderInstance>;
}

/**
 * Versatile and user-friendly input playback rate control designed for seamless cross-browser and
 * provider compatibility and accessibility with ARIA support. It offers a smooth user experience
 * for both mouse and touch interactions and is highly customizable in terms of styling.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/speed-slider}
 * @example
 * ```tsx
 * <SpeedSlider.Root>
 *   <SpeedSlider.Track>
 *     <SpeedSlider.TrackFill />
 *   </SpeedSlider.Track>
 *   <SpeedSlider.Thumb />
 * </SpeedSlider.Root>
 * ```
 */
const Root = React.forwardRef<SpeedSliderInstance, RootProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <SpeedSliderBridge {...props} ref={forwardRef}>
        {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
      </SpeedSliderBridge>
    );
  },
);

Root.displayName = 'SpeedSlider';

export * from './slider';
export { Root };
