import * as React from 'react';

import {
  createReactComponent,
  useReactContext,
  useSignal,
  useStateContext,
  type ReactElementProps,
} from 'maverick.js/react';
import { mediaContext, mediaState, type MediaProviderLoader } from 'vidstack';

import { isRemotionProvider } from '../providers/remotion/type-check';
import { MediaProviderInstance } from './primitives/instances';

/* -------------------------------------------------------------------------------------------------
 * MediaProvider
 * -----------------------------------------------------------------------------------------------*/

const MediaProviderBridge = createReactComponent(MediaProviderInstance);

export interface MediaProviderProps
  extends Omit<ReactElementProps<MediaProviderInstance>, 'loaders'> {
  loaders?: Array<{ new (): MediaProviderLoader }>;
  mediaProps?: React.HTMLAttributes<HTMLMediaElement>;
  children?: React.ReactNode;
  ref?: React.Ref<MediaProviderInstance>;
}

/**
 * Renders the current provider at this component location.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/provider}
 * @example
 * ```tsx
 * <MediaPlayer src="...">
 *   <MediaProvider />
 * </MediaPlayer>
 * ```
 */
const MediaProvider = React.forwardRef<MediaProviderInstance, MediaProviderProps>(
  ({ loaders = [], children, mediaProps, ...props }, forwardRef) => {
    const reactLoaders = React.useMemo(() => loaders.map((Loader) => new Loader()), loaders);

    return (
      <MediaProviderBridge {...props} loaders={reactLoaders} ref={forwardRef}>
        {(props, instance) => (
          <div {...props}>
            <MediaOutlet {...mediaProps} provider={instance} />
            {children}
          </div>
        )}
      </MediaProviderBridge>
    );
  },
);

MediaProvider.displayName = 'MediaProvider';
export { MediaProvider };

/* -------------------------------------------------------------------------------------------------
 * MediaOutlet
 * -----------------------------------------------------------------------------------------------*/

interface MediaOutletProps extends React.HTMLAttributes<HTMLMediaElement> {
  provider: MediaProviderInstance;
}

const YOUTUBE_TYPE = { src: '', type: 'video/youtube' },
  VIMEO_TYPE = { src: '', type: 'video/vimeo' },
  REMOTION_TYPE = { src: '', type: 'video/remotion' };

function MediaOutlet({ provider, ...props }: MediaOutletProps) {
  const { controls, crossorigin, poster } = useStateContext(mediaState),
    { loader } = provider.$state,
    {
      $iosControls: $$iosControls,
      $provider: $$provider,
      $providerSetup: $$providerSetup,
    } = useReactContext(mediaContext)!,
    $controls = useSignal(controls),
    $iosControls = useSignal($$iosControls),
    $nativeControls = $controls || $iosControls,
    $crossorigin = useSignal(crossorigin),
    $poster = useSignal(poster),
    $loader = useSignal(loader),
    $provider = useSignal($$provider),
    $providerSetup = useSignal($$providerSetup),
    $mediaType = $loader?.mediaType(),
    isYouTubeEmbed = $loader?.canPlay(YOUTUBE_TYPE),
    isVimeoEmbed = $loader?.canPlay(VIMEO_TYPE),
    isEmbed = isYouTubeEmbed || isVimeoEmbed;

  if ($loader?.canPlay(REMOTION_TYPE)) {
    return (
      <div data-remotion-canvas>
        <div
          data-remotion-container
          ref={(el) => {
            provider.load(el);
          }}
        >
          {isRemotionProvider($provider) && $providerSetup
            ? React.createElement($provider.render)
            : null}
        </div>
      </div>
    );
  }

  return isEmbed
    ? React.createElement(
        React.Fragment,
        null,
        React.createElement('iframe', {
          className: isYouTubeEmbed ? 'vds-youtube' : 'vds-vimeo',
          suppressHydrationWarning: true,
          'aria-hidden': 'true',
          'data-no-controls': !$nativeControls ? '' : undefined,
          ref(el: HTMLElement) {
            provider.load(el);
          },
        }),
        !$nativeControls ? React.createElement('div', { className: 'vds-blocker' }) : null,
      )
    : $mediaType
      ? React.createElement($mediaType === 'audio' ? 'audio' : 'video', {
          ...props,
          controls: $nativeControls ? '' : null,
          crossOrigin: typeof $crossorigin === 'boolean' ? '' : $crossorigin,
          poster: $mediaType === 'video' && $nativeControls && $poster ? $poster : null,
          preload: 'none',
          'aria-hidden': 'true',
          suppressHydrationWarning: true,
          ref(el: HTMLElement) {
            provider.load(el);
          },
        })
      : null;
}

MediaOutlet.displayName = 'MediaOutlet';
