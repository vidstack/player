import * as React from 'react';

import {
  createReactComponent,
  useSignal,
  useStateContext,
  type ReactElementProps,
} from 'maverick.js/react';
import { mediaState, type MediaProviderLoader } from 'vidstack';

import { useMediaContext } from '../hooks/use-media-context';
import { Icon } from '../icon';
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

function MediaOutlet({ provider, ...props }: MediaOutletProps) {
  const { crossOrigin, poster, remotePlaybackInfo, nativeControls } = useStateContext(mediaState),
    { loader } = provider.$state,
    { $provider: $$provider, $providerSetup: $$providerSetup } = useMediaContext(),
    $nativeControls = useSignal(nativeControls),
    $crossOrigin = useSignal(crossOrigin),
    $poster = useSignal(poster),
    $loader = useSignal(loader),
    $provider = useSignal($$provider),
    $providerSetup = useSignal($$providerSetup),
    $remoteInfo = useSignal(remotePlaybackInfo),
    $mediaType = $loader?.mediaType(),
    isYouTubeEmbed = $loader?.name === 'youtube',
    isVimeoEmbed = $loader?.name === 'vimeo',
    isEmbed = isYouTubeEmbed || isVimeoEmbed,
    isRemotion = $loader?.name === 'remotion',
    isGoogleCast = $loader?.name === 'google-cast',
    [googleCastIconPaths, setGoogleCastIconPaths] = React.useState('');

  React.useEffect(() => {
    if (!isGoogleCast || googleCastIconPaths) return;
    import('media-icons/dist/icons/chromecast.js').then((mod) => {
      setGoogleCastIconPaths(mod.default);
    });
  }, [isGoogleCast]);

  if (isGoogleCast) {
    return (
      <div
        className="vds-google-cast"
        ref={(el) => {
          provider.load(el);
        }}
      >
        <Icon paths={googleCastIconPaths} />
        {$remoteInfo?.deviceName ? (
          <span className="vds-google-cast-info">
            Google Cast on{' '}
            <span className="vds-google-cast-device-name">{$remoteInfo.deviceName}</span>
          </span>
        ) : null}
      </div>
    );
  }

  if (isRemotion) {
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
          tabIndex: !$nativeControls ? -1 : undefined,
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
          controls: $nativeControls ? true : null,
          crossOrigin: typeof $crossOrigin === 'boolean' ? '' : $crossOrigin,
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
