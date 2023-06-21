import {
  composeRefs,
  createReactComponent,
  useSignal,
  type ReactElementProps,
} from 'maverick.js/react';
import * as React from 'react';

import { SliderInstance, SliderPreviewInstance } from '../../primitives/instances';
import { Primitive, type PrimitivePropsWithRef } from '../../primitives/nodes';
import { SliderValueBridge, type SliderValueProps } from './slider-value';

/* -------------------------------------------------------------------------------------------------
 * Slider
 * -----------------------------------------------------------------------------------------------*/

const SliderBridge = createReactComponent(SliderInstance, {
  events: [
    'onDragStart',
    'onDragEnd',
    'onDragValueChange',
    'onValueChange',
    'onPointerValueChange',
  ],
});

export interface RootProps extends ReactElementProps<SliderInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<SliderInstance>;
}

/**
 * A custom-built range input that is cross-browser friendly, ARIA friendly, mouse/touch-friendly
 * and easily style-able. The slider allows users to input numeric values between a minimum and
 * maximum value.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/sliders/slider}
 */
const Root = React.forwardRef<SliderInstance, RootProps>(({ children, ...props }, forwardRef) => {
  return (
    <SliderBridge {...props} ref={forwardRef}>
      {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
    </SliderBridge>
  );
});

Root.displayName = 'Slider';

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

export interface ThumbProps extends PrimitivePropsWithRef<'div'> {}

const Thumb = React.forwardRef<HTMLElement, ThumbProps>((props, forwardRef) => (
  <Primitive.div {...props} ref={forwardRef as any} />
));

Thumb.displayName = 'SliderThumb';

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

export interface TrackProps extends PrimitivePropsWithRef<'div'> {}

const Track = React.forwardRef<HTMLElement, TrackProps>((props, forwardRef) => (
  <Primitive.div {...props} ref={forwardRef as any} />
));

Track.displayName = 'SliderTrack';

/* -------------------------------------------------------------------------------------------------
 * SliderTrackFill
 * -----------------------------------------------------------------------------------------------*/

export interface TrackFillProps extends PrimitivePropsWithRef<'div'> {}

const TrackFill = React.forwardRef<HTMLElement, TrackFillProps>((props, forwardRef) => (
  <Primitive.div {...props} ref={forwardRef as any} />
));

TrackFill.displayName = 'SliderTrackFill';

/* -------------------------------------------------------------------------------------------------
 * SliderPreview
 * -----------------------------------------------------------------------------------------------*/

const PreviewBridge = createReactComponent(SliderPreviewInstance);

export interface PreviewProps extends ReactElementProps<SliderPreviewInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * @docs {@link https://www.vidstack.io/docs/react/player/components/slider#preview}
 */
const Preview = React.forwardRef<HTMLElement, PreviewProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <PreviewBridge {...(props as Omit<PreviewProps, 'ref'>)}>
        {(props) => (
          <Primitive.div {...props} ref={composeRefs(props.ref, forwardRef)}>
            {children}
          </Primitive.div>
        )}
      </PreviewBridge>
    );
  },
);

Preview.displayName = 'SliderPreview';

/* -------------------------------------------------------------------------------------------------
 * SliderValue
 * -----------------------------------------------------------------------------------------------*/

export interface ValueProps extends SliderValueProps {}

/**
 * @docs {@link https://www.vidstack.io/docs/react/player/components/slider#preview}
 */
const Value = React.forwardRef<HTMLElement, ValueProps>(({ children, ...props }, forwardRef) => {
  return (
    <SliderValueBridge type="pointer" {...(props as Omit<ValueProps, 'ref'>)}>
      {(props, instance) => {
        const $text = useSignal(() => instance.getValueText(), instance);
        return (
          <Primitive.div {...props} ref={forwardRef as any}>
            {$text}
            {children}
          </Primitive.div>
        );
      }}
    </SliderValueBridge>
  );
});

Value.displayName = 'SliderValue';

export { Root, Thumb, Track, TrackFill, Preview, Value };
