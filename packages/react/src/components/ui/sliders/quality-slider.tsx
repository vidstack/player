import * as React from 'react';

import { createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { QualitySliderInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';
import { sliderCallbacks } from './slider-callbacks';

/* -------------------------------------------------------------------------------------------------
 * QualitySlider
 * -----------------------------------------------------------------------------------------------*/

const QualitySliderBridge = createReactComponent(QualitySliderInstance, {
  events: sliderCallbacks,
  domEventsRegex: /^onMedia/,
});

export interface RootProps extends ReactElementProps<QualitySliderInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<QualitySliderInstance>;
}

/**
 * Versatile and user-friendly input video quality control designed for seamless cross-browser and
 * provider compatibility and accessibility with ARIA support. It offers a smooth user experience
 * for both mouse and touch interactions and is highly customizable in terms of styling.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/quality-slider}
 * @example
 * ```tsx
 * <QualitySlider.Root>
 *   <QualitySlider.Track>
 *     <QualitySlider.TrackFill />
 *   </QualitySlider.Track>
 *   <QualitySlider.Thumb />
 * </QualitySlider.Root>
 * ```
 */
const Root = React.forwardRef<QualitySliderInstance, RootProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <QualitySliderBridge {...props} ref={forwardRef}>
        {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
      </QualitySliderBridge>
    );
  },
);

Root.displayName = 'QualitySlider';

export * from './slider';
export { Root };
