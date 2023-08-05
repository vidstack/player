import * as React from 'react';
import {
  composeRefs,
  createReactComponent,
  useSignal,
  type ReactElementProps,
} from 'maverick.js/react';
import { VolumeSliderInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';
import { type ValueProps } from './slider';
import { SliderValueBridge } from './slider-value';

/* -------------------------------------------------------------------------------------------------
 * VolumeSlider
 * -----------------------------------------------------------------------------------------------*/

const VolumeSliderBridge = createReactComponent(VolumeSliderInstance);

export interface RootProps extends ReactElementProps<VolumeSliderInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<VolumeSliderInstance>;
}

/**
 * A slider control that lets the user specify their desired volume level.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/sliders/volume-slider}
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

/* -------------------------------------------------------------------------------------------------
 * SliderValue
 * -----------------------------------------------------------------------------------------------*/

/**
 * @docs {@link https://www.vidstack.io/docs/react/player/components/volume-slider#preview}
 */
const Value = React.forwardRef<HTMLElement, ValueProps>(({ children, ...props }, forwardRef) => {
  return (
    <SliderValueBridge type="pointer" format="percent" {...(props as Omit<ValueProps, 'ref'>)}>
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
