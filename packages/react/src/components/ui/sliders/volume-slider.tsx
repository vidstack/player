import * as React from 'react';

import { createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { VolumeSliderInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';
import { sliderCallbacks } from './slider-callbacks';

/* -------------------------------------------------------------------------------------------------
 * VolumeSlider
 * -----------------------------------------------------------------------------------------------*/

const VolumeSliderBridge = createReactComponent(VolumeSliderInstance, {
  events: sliderCallbacks,
  domEventsRegex: /^onMedia/,
});

export interface RootProps extends ReactElementProps<VolumeSliderInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<VolumeSliderInstance>;
}

/**
 * Versatile and user-friendly input volume control designed for seamless cross-browser and provider
 * compatibility and accessibility with ARIA support. It offers a smooth user experience for both
 * mouse and touch interactions and is highly customizable in terms of styling. Users can
 * effortlessly change the volume level within the range 0 (muted) to 100.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/volume-slider}
 * @example
 * ```tsx
 * <VolumeSlider.Root>
 *   <VolumeSlider.Track>
 *     <VolumeSlider.TrackFill />
 *   </VolumeSlider.Track>
 *   <VolumeSlider.Thumb />
 * </VolumeSlider.Root>
 * ```
 */
const Root = React.forwardRef<VolumeSliderInstance, RootProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <VolumeSliderBridge {...props} ref={forwardRef}>
        {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
      </VolumeSliderBridge>
    );
  },
);

Root.displayName = 'VolumeSlider';

export * from './slider';
export { Root };
