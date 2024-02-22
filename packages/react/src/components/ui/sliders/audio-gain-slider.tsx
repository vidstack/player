import * as React from 'react';

import {
  composeRefs,
  createReactComponent,
  useSignal,
  type ReactElementProps,
} from 'maverick.js/react';

import { AudioGainSliderInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';
import { type ValueProps } from './slider';
import { SliderValueBridge } from './slider-value';

/* -------------------------------------------------------------------------------------------------
 * AudioGainSlider
 * -----------------------------------------------------------------------------------------------*/

const AudioGainSliderBridge = createReactComponent(AudioGainSliderInstance, {
  domEventsRegex: /^onMedia/,
});

export interface RootProps extends ReactElementProps<AudioGainSliderInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<AudioGainSliderInstance>;
}

/**
 * Versatile and user-friendly audio boost control designed for seamless cross-browser and provider
 * compatibility and accessibility with ARIA support. It offers a smooth user experience for both
 * mouse and touch interactions and is highly customizable in terms of styling. Users can
 * effortlessly change the audio gain within the range 0 to 100.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/audio-gain-slider}
 * @example
 * ```tsx
 * <AudioGainSlider.Root>
 *   <AudioGainSlider.Track>
 *     <AudioGainSlider.TrackFill />
 *   </AudioGainSlider.Track>
 *   <AudioGainSlider.Thumb />
 * </AudioGainSlider.Root>
 * ```
 */
const Root = React.forwardRef<AudioGainSliderInstance, RootProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <AudioGainSliderBridge {...props} ref={forwardRef}>
        {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
      </AudioGainSliderBridge>
    );
  },
);

Root.displayName = 'AudioGainSlider';

/* -------------------------------------------------------------------------------------------------
 * SliderValue
 * -----------------------------------------------------------------------------------------------*/

/**
 * Displays the specific numeric representation of the current or pointer value of the audio gain
 * slider. When a user interacts with a slider by moving its thumb along the track, the slider value
 * and audio gain updates accordingly.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/audio-gain-slider#value}
 * @example
 * ```tsx
 * <AudioGainSlider.Root>
 *   <AudioGainSlider.Preview>
 *     <AudioGainSlider.Value />
 *   </AudioGainSlider.Preview>
 * </AudioGainSlider.Root>
 * ```
 */
const Value = React.forwardRef<HTMLElement, ValueProps>(({ children, ...props }, forwardRef) => {
  return (
    <SliderValueBridge {...(props as Omit<ValueProps, 'ref'>)}>
      {(props, instance) => {
        const $text = useSignal(() => instance.getValueText(), instance);
        return (
          <Primitive.div {...props} ref={composeRefs(props.ref, forwardRef)}>
            {$text}
            {children}
          </Primitive.div>
        );
      }}
    </SliderValueBridge>
  );
});

Value.displayName = 'SliderValue';

export * from './slider';
export { Root, Value };
