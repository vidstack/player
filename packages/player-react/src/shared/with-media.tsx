import { isFunction } from '@vidstack/foundation';
import type { MediaElement } from '@vidstack/player';
// eslint-disable-next-line import/default
import React, { type FC, forwardRef, type ReactNode, type Ref, useState } from 'react';

import { MediaElementContext } from './use-media';

export type WrappedMedia = FC<{
  [propName: string]: unknown;
  ref?: Ref<MediaElement> | undefined;
}>;

export type WithMediaProps = {
  [propName: string]: unknown;
  children?: ReactNode | undefined;
};

export function withMedia(WrappedMedia: WrappedMedia): unknown {
  const hoc = forwardRef<MediaElement, WithMediaProps>(({ children, ...props }, _ref) => {
    const [ref, setRef] = useState<MediaElement | null>(null);

    return (
      <MediaElementContext.Provider value={ref}>
        <WrappedMedia
          {...props}
          ref={(el) => {
            setRef(el);

            if (isFunction(_ref)) {
              _ref(el);
            } else if (_ref) {
              _ref.current = el;
            }
          }}
        >
          {children}
        </WrappedMedia>
      </MediaElementContext.Provider>
    );
  });

  hoc.displayName = 'WithMediaHOC';
  return hoc;
}
