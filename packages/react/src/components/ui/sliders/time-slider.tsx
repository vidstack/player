import * as React from 'react';
import { effect } from 'maverick.js';
import {
  composeRefs,
  createReactComponent,
  useReactContext,
  useSignal,
  useStateContext,
  type ReactElementProps,
} from 'maverick.js/react';
import { VTTCue } from 'media-captions';
import { mediaState, timeSliderContext } from 'vidstack/lib';
import {
  SliderThumbnailInstance,
  SliderVideoInstance,
  TimeSliderInstance,
} from '../../primitives/instances';
import { Primitive, type PrimitivePropsWithRef } from '../../primitives/nodes';
import * as ThumbnailBase from '../thumbnail';
import { type ValueProps } from './slider';
import { SliderValueBridge } from './slider-value';

/* -------------------------------------------------------------------------------------------------
 * TimeSlider
 * -----------------------------------------------------------------------------------------------*/

const TimeSliderBridge = createReactComponent(TimeSliderInstance);

export interface RootProps extends ReactElementProps<TimeSliderInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<TimeSliderInstance>;
}

/**
 * A slider control that lets the user specify their desired volume level.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/sliders/volume-slider}
 */
const Root = React.forwardRef<TimeSliderInstance, RootProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <TimeSliderBridge {...props} ref={forwardRef}>
        {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
      </TimeSliderBridge>
    );
  },
);

Root.displayName = 'TimeSlider';

/* -------------------------------------------------------------------------------------------------
 * SliderChapters
 * -----------------------------------------------------------------------------------------------*/

export interface ChaptersProps extends Omit<PrimitivePropsWithRef<'div'>, 'children'> {
  children: (cues: VTTCue[], forwardRef: React.RefCallback<HTMLElement>) => React.ReactNode;
}

/**
 * @docs {@link https://www.vidstack.io/docs/react/player/components/time-slider#chapters}
 */
const Chapters = React.forwardRef<HTMLDivElement, ChaptersProps>(
  ({ children, ...props }, forwardRef) => {
    const { chapters } = useReactContext(timeSliderContext)!,
      $cues = useSignal(() => chapters.cues, chapters),
      refs = React.useRef<HTMLElement[]>([]),
      emptyCue = React.useRef<VTTCue>();

    if (!emptyCue.current) {
      emptyCue.current = new VTTCue(0, 0, '');
    }

    React.useEffect(() => {
      chapters.addRefs(refs.current);
    }, [$cues]);

    return (
      <Primitive.div {...props} ref={forwardRef}>
        {children($cues.length ? $cues : [emptyCue.current], (el) => {
          if (!el) {
            refs.current.length = 0;
            return;
          }

          refs.current.push(el);
        })}
      </Primitive.div>
    );
  },
);

Chapters.displayName = 'SliderChapters';

/* -------------------------------------------------------------------------------------------------
 * SliderChapterTitle
 * -----------------------------------------------------------------------------------------------*/

export interface ChapterTitleProps extends PrimitivePropsWithRef<'div'> {}

const ChapterTitle = React.forwardRef<HTMLElement, ChapterTitleProps>(
  ({ children, ...props }, forwardRef) => {
    const { chapters } = useReactContext(timeSliderContext)!,
      [title, setTitle] = React.useState<string>();

    React.useEffect(() => {
      return effect(() => {
        const cue = chapters.activePointerCue || chapters.activeCue;
        setTitle(cue?.text || '');
      });
    }, []);

    return (
      <Primitive.div {...props} ref={forwardRef as any}>
        {title}
        {children}
      </Primitive.div>
    );
  },
);

ChapterTitle.displayName = 'SliderChapterTitle';

/* -------------------------------------------------------------------------------------------------
 * SliderValue
 * -----------------------------------------------------------------------------------------------*/

/**
 * @docs {@link https://www.vidstack.io/docs/react/player/components/time-slider#preview}
 */
const Value = React.forwardRef<HTMLElement, ValueProps>(({ children, ...props }, forwardRef) => {
  return (
    <SliderValueBridge type="pointer" format="time" {...(props as Omit<ValueProps, 'ref'>)}>
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

/* -------------------------------------------------------------------------------------------------
 * SliderProgress
 * -----------------------------------------------------------------------------------------------*/

export interface ProgressProps extends PrimitivePropsWithRef<'div'> {}

const Progress = React.forwardRef<HTMLElement, ProgressProps>((props, forwardRef) => (
  <Primitive.div {...props} ref={forwardRef as any} />
));

Progress.displayName = 'SliderProgress';

/* -------------------------------------------------------------------------------------------------
 * SliderThumbnail
 * -----------------------------------------------------------------------------------------------*/

const SliderThumbnailBridge = createReactComponent(SliderThumbnailInstance);

export interface ThumbnailProps extends ReactElementProps<SliderThumbnailInstance, HTMLElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

export type ThumbnailImgProps = ThumbnailBase.ImgProps;

/**
 * Used to display preview thumbnails when the user is hovering or dragging the time slider.
 * The time ranges in the WebVTT file will automatically be matched based on the current slider
 * pointer position.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/sliders/slider-thumbnail}
 */
const ThumbnailRoot = React.forwardRef<HTMLElement, ThumbnailProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <SliderThumbnailBridge {...(props as Omit<ThumbnailProps, 'ref'>)}>
        {(props) => (
          <Primitive.div {...props} ref={composeRefs(props.ref, forwardRef)}>
            {children}
          </Primitive.div>
        )}
      </SliderThumbnailBridge>
    );
  },
);

ThumbnailRoot.displayName = 'SliderThumbnail';

const Thumbnail = {
  Root: ThumbnailRoot,
  Img: ThumbnailBase.Img,
} as const;

/* -------------------------------------------------------------------------------------------------
 * SliderVideo
 * -----------------------------------------------------------------------------------------------*/

const VideoBridge = createReactComponent(SliderVideoInstance, {
  events: ['onCanPlay', 'onError'],
});

export interface VideoProps extends ReactElementProps<SliderVideoInstance, HTMLVideoElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLVideoElement>;
}

/**
 * Used to load a low-resolution video to be displayed when the user is hovering over or dragging
 * the time slider. The preview video will automatically be updated to be in-sync with the current
 * preview position, so ensure it has the same length as the original media (i.e., same duration).
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/sliders/slider-video}
 */
const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <VideoBridge {...(props as Omit<VideoProps, 'ref'>)}>
        {(props, instance) => (
          <VideoProvider {...props} instance={instance} ref={composeRefs(props.ref, forwardRef)}>
            {children}
          </VideoProvider>
        )}
      </VideoBridge>
    );
  },
);

Video.displayName = 'SliderVideo';

/* -------------------------------------------------------------------------------------------------
 * SliderVideoProvider
 * -----------------------------------------------------------------------------------------------*/

export interface VideoProviderProps {
  instance: SliderVideoInstance;
  children?: React.ReactNode;
}

const VideoProvider = React.forwardRef<HTMLVideoElement, VideoProviderProps>(
  ({ instance, children, ...props }, forwardRef) => {
    const { crossorigin, canLoad } = useStateContext(mediaState),
      { src, video } = instance.$state,
      $src = useSignal(src),
      $canLoad = useSignal(canLoad),
      $crossorigin = useSignal(crossorigin);
    return (
      <Primitive.video
        style={{ maxWidth: 'unset' }}
        {...props}
        src={$src || undefined}
        muted
        playsInline
        preload={$canLoad ? 'auto' : 'none'}
        crossOrigin={($crossorigin as '') || undefined}
        ref={composeRefs(video.set as any, forwardRef)}
      >
        {children}
      </Primitive.video>
    );
  },
);

VideoProvider.displayName = 'SliderVideoProvider';

export * from './slider';
export { Root, Progress, Value, Thumbnail, Video, Chapters, ChapterTitle };
