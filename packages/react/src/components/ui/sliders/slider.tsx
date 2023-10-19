import * as React from 'react';

import {
  composeRefs,
  createReactComponent,
  useSignal,
  type ReactElementProps,
} from 'maverick.js/react';

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
 * Versatile and user-friendly input control designed for seamless cross-browser compatibility and
 * accessibility with ARIA support. It offers a smooth user experience for both mouse and touch
 * interactions and is highly customizable in terms of styling. Users can effortlessly input numeric
 * values within a specified range, defined by a minimum and maximum value.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider}
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Track>
 *     <Slider.TrackFill />
 *   </Slider.Track>
 *   <Slider.Thumb />
 * </Slider.Root>
 * ```
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

/**
 * Purely visual element used to display a draggable handle to the user for adjusting the value
 * on the slider component.
 *
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Thumb />
 * </Slider.Root>
 * ```
 */
const Thumb = React.forwardRef<HTMLElement, ThumbProps>((props, forwardRef) => (
  <Primitive.div {...props} ref={forwardRef as any} />
));

Thumb.displayName = 'SliderThumb';

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

export interface TrackProps extends PrimitivePropsWithRef<'div'> {}

/**
 * Visual element inside the slider that serves as a horizontal or vertical bar, providing a
 * visual reference for the range or values that can be selected by moving the slider thumb along
 * it. Users can interact with the slider by dragging the thumb along the track to set a specific
 * value.
 *
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Track>
 *     <Slider.TrackFill />
 *   </Slider.Track>
 * </Slider.Root>
 * ```
 */
const Track = React.forwardRef<HTMLElement, TrackProps>((props, forwardRef) => (
  <Primitive.div {...props} ref={forwardRef as any} />
));

Track.displayName = 'SliderTrack';

/* -------------------------------------------------------------------------------------------------
 * SliderTrackFill
 * -----------------------------------------------------------------------------------------------*/

export interface TrackFillProps extends PrimitivePropsWithRef<'div'> {}

/**
 * Portion of the slider track that is visually filled or highlighted to indicate the selected or
 * currently chosen range or value. As the slider thumb is moved along the track, the track
 * fill dynamically adjusts to visually represent the portion of the track that corresponds to the
 * selected value or range, providing users with a clear visual indication of their selection.
 *
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Track>
 *     <Slider.TrackFill />
 *   </Slider.Track>
 * </Slider.Root>
 * ```
 */
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
 * Used to provide users with a real-time or interactive preview of the value or selection they
 * are making as they move the slider thumb. This can include displaying the current pointer
 * value numerically, or displaying a thumbnail over the time slider.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/slider#preview}
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Preview>
 *     <Slider.Value />
 *   </Slider.Preview>
 * </Slider.Root>
 * ```
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
 * Displays the specific numeric representation of the current or pointer value of the slider.
 * When a user interacts with a slider by moving its thumb along the track, the slider value
 * changes accordingly.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/slider#preview}
 * @example
 * ```tsx
 * <Slider.Root>
 *   <Slider.Preview>
 *     <Slider.Value />
 *   </Slider.Preview>
 * </Slider.Root>
 * ```
 */
const Value = React.forwardRef<HTMLElement, ValueProps>(({ children, ...props }, forwardRef) => {
  return (
    <SliderValueBridge {...(props as Omit<ValueProps, 'ref'>)}>
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
