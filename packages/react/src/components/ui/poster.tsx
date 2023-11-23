import * as React from 'react';

import {
  composeRefs,
  createReactComponent,
  useSignal,
  useStateContext,
  type ReactElementProps,
} from 'maverick.js/react';
import { mediaState } from 'vidstack';

import { PosterInstance } from '../primitives/instances';
import { Primitive } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Poster
 * -----------------------------------------------------------------------------------------------*/

const PosterBridge = createReactComponent(PosterInstance);

export interface PosterProps extends ReactElementProps<PosterInstance, HTMLImageElement> {
  alt: string;
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLImageElement>;
}

/**
 * Loads and displays the current media poster image. By default, the media provider's
 * loading strategy is respected meaning the poster won't load until the media can.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/poster}
 * @example
 * ```tsx
 * <MediaPlayer>
 *   <MediaProvider>
 *     <Poster src="..." alt="..." />
 *   </MediaProvider>
 * </MediaPlayer>
 * ```
 */
const Poster = React.forwardRef<HTMLImageElement, PosterProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <PosterBridge {...(props as Omit<PosterProps, 'ref'>)}>
        {(props, instance) => (
          <PosterImg {...props} instance={instance} ref={composeRefs(props.ref, forwardRef)}>
            {children}
          </PosterImg>
        )}
      </PosterBridge>
    );
  },
);

Poster.displayName = 'Poster';
export { Poster };

/* -------------------------------------------------------------------------------------------------
 * PosterImg
 * -----------------------------------------------------------------------------------------------*/

interface PosterImgProps {
  instance: PosterInstance;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLImageElement>;
}

const PosterImg = React.forwardRef<HTMLImageElement, PosterImgProps>(
  ({ instance, children, ...props }, forwardRef) => {
    const { crossorigin } = useStateContext(mediaState),
      { src, alt, img } = instance.$state,
      $crossorigin = useSignal(crossorigin),
      $src = useSignal(src),
      $alt = useSignal(alt);
    return (
      <Primitive.img
        {...props}
        src={$src || undefined}
        alt={$alt || undefined}
        crossOrigin={
          /ytimg\.com|vimeo/.test($src || '') ? undefined : ($crossorigin as '' | undefined)
        }
        ref={composeRefs(img.set as any, forwardRef)}
      >
        {children}
      </Primitive.img>
    );
  },
);

PosterImg.displayName = 'PosterImg';
