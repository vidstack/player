import * as React from 'react';

import {
  createReactComponent,
  useReactContext,
  useSignal,
  useStateContext,
  type ReactElementProps,
} from 'maverick.js/react';
import { mediaContext, mediaState } from 'vidstack';

import { MediaProviderInstance } from './primitives/instances';

/* -------------------------------------------------------------------------------------------------
 * MediaProvider
 * -----------------------------------------------------------------------------------------------*/

const MediaProviderBridge = createReactComponent(MediaProviderInstance);

export interface MediaProviderProps extends ReactElementProps<MediaProviderInstance> {
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
  ({ children, mediaProps, ...props }, forwardRef) => {
    return (
      <MediaProviderBridge {...props} ref={forwardRef}>
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
  const { controls, crossorigin, poster } = useStateContext(mediaState),
    { loader } = provider.$state,
    { $iosControls: iosControls } = useReactContext(mediaContext)!,
    $controls = useSignal(controls),
    $iosControls = useSignal(iosControls),
    $crossorigin = useSignal(crossorigin),
    $poster = useSignal(poster),
    $loader = useSignal(loader),
    $mediaType = $loader?.mediaType();

  return $mediaType
    ? React.createElement($mediaType === 'audio' ? 'audio' : 'video', {
        ...props,
        controls: $controls || $iosControls,
        crossOrigin: typeof $crossorigin === 'boolean' ? '' : $crossorigin,
        poster: $mediaType === 'video' && $controls && $poster ? $poster : null,
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
