import * as React from 'react';

import { noop } from 'maverick.js/std';
import { Internals, random, type TimelineContextValue } from 'remotion';

import { Primitive, type PrimitivePropsWithRef } from '../../../components/primitives/nodes';
import { useMediaState } from '../../../hooks/use-media-state';
import { RemotionLayoutEngine } from '../layout-engine';
import { isRemotionSrc } from '../type-check';
import type { RemotionErrorRenderer, RemotionLoadingRenderer, RemotionSrc } from '../types';
import { REMOTION_PROVIDER_ID, RemotionContextProvider } from './context';
import { ErrorBoundary } from './error-boundary';

export interface RemotionThumbnailProps
  extends Omit<PrimitivePropsWithRef<'div'>, 'children' | 'onError'> {
  /** The video frame to display. */
  frame: number;
  /**
   * A callback function that allows you to return a custom UI that gets displayed while the
   * thumbnail is loading. If this prop is not provided it will default to the loading renderer
   * given to the player source.
   */
  renderLoading?: RemotionLoadingRenderer;
  /**
   * A callback for rendering a custom error message. If this prop is not provided it will default
   * to the error renderer given to the player source.
   */
  errorFallback?: RemotionErrorRenderer;
  /**
   * Called when an error or uncaught exception has happened in the video. If this prop is not
   * provided it will default to the error callback given to the player source.
   */
  onError?(error: Error): void;
}

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/remotion/remotion-thumbnail}
 * @example
 * ```tsx
 * <RemotionThumbnail frame={100} />
 * ```
 */
const RemotionThumbnail = React.forwardRef<HTMLElement, RemotionThumbnailProps>(
  ({ frame, renderLoading, errorFallback, onError, ...props }, ref) => {
    let $src = useMediaState('currentSrc'),
      layoutEngine = React.useMemo(() => new RemotionLayoutEngine(), []);

    // Initialize defaults.
    if (isRemotionSrc($src) && !$src.compositionWidth) {
      $src = {
        compositionWidth: 1920,
        compositionHeight: 1080,
        fps: 30,
        ...$src,
      };
    }

    React.useEffect(() => {
      layoutEngine.setSrc(isRemotionSrc($src) ? $src : null);
      return () => void layoutEngine.setSrc(null);
    }, [$src]);

    const Component = Internals.useLazyComponent({
      component: $src.src as RemotionSrc['src'],
    }) as React.LazyExoticComponent<React.ComponentType<unknown>>;

    const thumbnailId = React.useMemo(() => String(random(null)), []),
      baseTimeline = React.useMemo<TimelineContextValue>(
        () => ({
          rootId: thumbnailId,
          frame: { [REMOTION_PROVIDER_ID]: frame },
          playing: false,
          playbackRate: 1,
          setPlaybackRate: noop,
          audioAndVideoTags: { current: [] },
          imperativePlaying: { current: false },
        }),
        [thumbnailId],
      ),
      timeline = React.useMemo(
        () => ({
          ...baseTimeline,
          frame: { [REMOTION_PROVIDER_ID]: frame },
        }),
        [baseTimeline, frame],
      ),
      volume = React.useMemo(
        () => ({
          mediaMuted: true,
          mediaVolume: 0,
          setMediaMuted: noop,
          setMediaVolume: noop,
        }),
        [],
      );

    const [, _update] = React.useState(0);
    React.useEffect(() => {
      _update(1);
    }, []);

    if (!isRemotionSrc($src)) return null;

    return (
      <RemotionContextProvider
        src={$src}
        component={Component}
        timeline={timeline}
        mediaVolume={volume}
        setMediaVolume={volume}
        numberOfSharedAudioTags={0}
      >
        <Primitive.div {...props} ref={ref as any} data-remotion-thumbnail>
          <div data-remotion-canvas>
            <div
              data-remotion-container
              ref={(el) => {
                layoutEngine.setContainer(el);
              }}
            >
              <RemotionThumbnailUI
                inputProps={$src.inputProps}
                renderLoading={renderLoading ?? $src.renderLoading}
                errorFallback={errorFallback ?? $src.errorFallback}
                onError={onError ?? $src.onError}
              />
            </div>
          </div>
        </Primitive.div>
      </RemotionContextProvider>
    );
  },
);

RemotionThumbnail.displayName = 'RemotionThumbnail';
export default RemotionThumbnail;

interface RemotionThumbnailUIProps
  extends Pick<RemotionThumbnailProps, 'renderLoading' | 'errorFallback' | 'onError'> {
  inputProps?: RemotionSrc['inputProps'];
}

function RemotionThumbnailUI({
  inputProps,
  renderLoading,
  errorFallback,
  onError,
}: RemotionThumbnailUIProps) {
  const video = Internals.useVideo(),
    Video = video ? video.component : null,
    LoadingContent = React.useMemo(() => renderLoading?.(), [renderLoading]);

  return (
    <React.Suspense fallback={LoadingContent}>
      {Video ? (
        <ErrorBoundary fallback={errorFallback} onError={onError!}>
          <Internals.ClipComposition>
            <Video {...video?.props} {...inputProps} />
          </Internals.ClipComposition>
        </ErrorBoundary>
      ) : null}
    </React.Suspense>
  );
}

RemotionThumbnailUI.displayName = 'RemotionThumbnailUI';
