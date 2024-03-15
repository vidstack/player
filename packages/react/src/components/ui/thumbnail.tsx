import * as React from 'react';

import type { WriteSignal } from 'maverick.js';
import {
  composeRefs,
  createReactComponent,
  useSignal,
  useStateContext,
  type ReactElementProps,
} from 'maverick.js/react';
import { mediaState } from 'vidstack';

import { ThumbnailInstance } from '../primitives/instances';
import { Primitive, type PrimitivePropsWithRef } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Thumbnail
 * -----------------------------------------------------------------------------------------------*/

const ThumbnailBridge = createReactComponent(ThumbnailInstance);

export interface RootProps extends ReactElementProps<ThumbnailInstance, HTMLElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * Used to load and display a preview thumbnail at the given `time`.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/thumbnail}
 * @example
 * ```tsx
 * <Thumbnail.Root src="thumbnails.vtt" time={10} >
 *   <Thumbnail.Img />
 * </Thumbnail.Root>
 * ```
 */
const Root = React.forwardRef<HTMLElement, RootProps>(({ children, ...props }, forwardRef) => {
  return (
    <ThumbnailBridge {...(props as Omit<RootProps, 'ref'>)}>
      {(props) => (
        <Primitive.div
          {...props}
          ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
        >
          {children}
        </Primitive.div>
      )}
    </ThumbnailBridge>
  );
});

Root.displayName = 'Thumbnail';

/* -------------------------------------------------------------------------------------------------
 * ThumbnailImg
 * -----------------------------------------------------------------------------------------------*/

export interface ImgProps extends PrimitivePropsWithRef<'img'> {
  children?: React.ReactNode;
}

const Img = React.forwardRef<HTMLImageElement, ImgProps>(({ children, ...props }, forwardRef) => {
  const { src, img, crossOrigin } = useStateContext(ThumbnailInstance.state),
    $src = useSignal(src),
    $crossOrigin = useSignal(crossOrigin);
  return (
    <Primitive.img
      crossOrigin={$crossOrigin as '' | undefined}
      {...props}
      src={$src}
      ref={composeRefs((img as any).set, forwardRef)}
    >
      {children}
    </Primitive.img>
  );
});

Img.displayName = 'ThumbnailImg';

export { Root, Img };
