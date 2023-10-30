import * as React from 'react';

import { effect, signal, type WriteSignal } from 'maverick.js';
import {
  composeRefs,
  createReactComponent,
  useSignal,
  useStateContext,
  type ReactElementProps,
} from 'maverick.js/react';
import type { VTTCue } from 'media-captions';
import { mediaState } from 'vidstack';

import { createVTTCue } from '../../../utils';
import {
  SliderChaptersInstance,
  SliderThumbnailInstance,
  SliderVideoInstance,
  TimeSliderInstance,
} from '../../primitives/instances';
import { Primitive, type PrimitivePropsWithRef } from '../../primitives/nodes';
import * as ThumbnailBase from '../thumbnail';
import { type ValueProps } from './slider';
import { SliderValueBridge } from './slider-value';

/* -------------------------------------------------------------------------------------------------
 * TimeSliderContext
 * -----------------------------------------------------------------------------------------------*/

const TimeSliderContext = React.createContext<TimeSliderContext>({
  $chapters: signal<SliderChaptersInstance | null>(null),
});

interface TimeSliderContext {
  $chapters: WriteSignal<SliderChaptersInstance | null>;
}

TimeSliderContext.displayName = 'TimeSliderContext';

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
 * Versatile and user-friendly input time control designed for seamless cross-browser and provider
 * compatibility and accessibility with ARIA support. It offers a smooth user experience for both
 * mouse and touch interactions and is highly customizable in terms of styling. Users can
 * effortlessly change the current playback time within the range 0 to seekable end.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/time-slider}
 * @example
 * ```tsx
 * <TimeSlider.Root>
 *   <TimeSlider.Track>
 *     <TimeSlider.TrackFill />
 *     <TimeSlider.Progress />
 *   </TimeSlider.Track>
 *   <TimeSlider.Thumb />
 * </TimeSlider.Root>
 * ```
 */
const Root = React.forwardRef<TimeSliderInstance, RootProps>(
  ({ children, ...props }, forwardRef) => {
    const $chapters = React.useMemo(() => signal<SliderChaptersInstance | null>(null), []);
    return (
      <TimeSliderContext.Provider value={{ $chapters }}>
        <TimeSliderBridge {...props} ref={forwardRef}>
          {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
        </TimeSliderBridge>
      </TimeSliderContext.Provider>
    );
  },
);

Root.displayName = 'TimeSlider';

/* -------------------------------------------------------------------------------------------------
 * SliderChapters
 * -----------------------------------------------------------------------------------------------*/

const SliderChaptersBridge = createReactComponent(SliderChaptersInstance);

export interface ChaptersProps extends Omit<ReactElementProps<SliderChaptersInstance>, 'children'> {
  children: (cues: VTTCue[], forwardRef: React.RefCallback<HTMLElement>) => React.ReactNode;
}

/**
 * Used to create predefined sections within a time slider interface based on the currently
 * active chapters text track.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/slider-chapters}
 * @example
 * ```tsx
 * <TimeSlider.Root>
 *   <TimeSlider.Chapters>
 *     {(cues, forwardRef) =>
 *       cues.map((cue) => (
 *         <div key={cue.startTime} ref={forwardRef}>
 *           <TimeSlider.Track>
 *             <TimeSlider.TrackFill />
 *             <TimeSlider.Progress />
 *           </TimeSlider.Track>
 *        </div>
 *     ))}
 *   </TimeSlider.Chapters>
 * </TimeSlider.Root>
 * ```
 */
const Chapters = React.forwardRef<HTMLDivElement, ChaptersProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <SliderChaptersBridge {...props}>
        {(props, instance) => (
          <Primitive.div {...props} ref={composeRefs(props.ref, forwardRef)}>
            <ChapterTracks instance={instance}>{children}</ChapterTracks>
          </Primitive.div>
        )}
      </SliderChaptersBridge>
    );
  },
);

Chapters.displayName = 'SliderChapters';

interface ChapterTracksProps {
  instance: SliderChaptersInstance;
  children: ChaptersProps['children'];
}

function ChapterTracks({ instance, children }: ChapterTracksProps) {
  const $cues = useSignal(() => instance.cues, instance),
    refs = React.useRef<HTMLElement[]>([]),
    emptyCue = React.useRef<VTTCue>(),
    { $chapters } = React.useContext(TimeSliderContext);

  if (!emptyCue.current) {
    emptyCue.current = createVTTCue();
  }

  React.useEffect(() => {
    $chapters.set(instance);
    return () => void $chapters.set(null);
  }, [instance]);

  React.useEffect(() => {
    instance.setRefs(refs.current);
  }, [$cues]);

  return children($cues.length ? $cues : [emptyCue.current], (el) => {
    if (!el) {
      refs.current.length = 0;
      return;
    }

    refs.current.push(el);
  });
}

ChapterTracks.displayName = 'SliderChapterTracks';

/* -------------------------------------------------------------------------------------------------
 * SliderChapterTitle
 * -----------------------------------------------------------------------------------------------*/

export interface ChapterTitleProps extends PrimitivePropsWithRef<'div'> {}

/**
 * Used to display the active cue text based on the slider value and preview value.
 *
 * @example
 * ```tsx
 * <TimeSlider.Root>
 *   <TimeSlider.Preview>
 *     <TimeSlider.Chapter />
 *   </TimeSlider.Preview>
 * </TimeSlider.Root>
 * ```
 */
const ChapterTitle = React.forwardRef<HTMLElement, ChapterTitleProps>(
  ({ children, ...props }, forwardRef) => {
    const { $chapters } = React.useContext(TimeSliderContext)!,
      [title, setTitle] = React.useState<string>();

    React.useEffect(() => {
      return effect(() => {
        const chapters = $chapters(),
          cue = chapters?.activePointerCue || chapters?.activeCue;
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
 * Displays the specific numeric representation of the current or pointer value of the time slider.
 * When a user interacts with a slider by moving its thumb along the track, the slider value
 * and current playback time updates accordingly.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/time-slider#preview}
 * @example
 * ```tsx
 * <TimeSlider.Root>
 *   <TimeSlider.Preview>
 *     <TimeSlider.Value />
 *   </TimeSlider.Preview>
 * </TimeSlider.Root>
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

/* -------------------------------------------------------------------------------------------------
 * SliderProgress
 * -----------------------------------------------------------------------------------------------*/

export interface ProgressProps extends PrimitivePropsWithRef<'div'> {}

/**
 * Visual element inside the slider that serves as a horizontal or vertical bar, providing a
 * visual reference for the range of playback that has buffered/loaded.
 *
 * @example
 * ```tsx
 * <TimeSlider.Root>
 *   <TimeSlider.Track>
 *     <TimeSlider.Progress />
 *   </TimeSlider.Track>
 * </TimeSlider.Root>
 * ```
 */
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
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-thumbnail}
 *
 * @example
 * ```tsx
 * <TimeSlider.Root>
 *   <TimeSlider.Preview>
 *     <TimeSlider.Thumbnail.Root src="thumbnails.vtt">
 *       <TimeSlider.Thumbnail.Img />
 *     </TimeSlider.Thumbnail.Root>
 *   </TimeSlider.Preview>
 * </TimeSlider.Root>
 * ```
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
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-video}
 * @example
 * ```tsx
 * <TimeSlider.Root>
 *   <TimeSlider.Preview>
 *     <TimeSlider.Video src="preview.mp4" />
 *   </TimeSlider.Preview>
 * </TimeSlider.Root>
 * ```
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
