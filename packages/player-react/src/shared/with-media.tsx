import { isFunction } from '@vidstack/foundation';
import type { MediaElement } from '@vidstack/player';
// eslint-disable-next-line import/default
import React, {
  type FC,
  type ForwardedRef,
  type ReactNode,
  type Ref,
  useEffect,
  useState,
} from 'react';

import { MediaElementContext } from './use-media';

export type WrappedMedia = FC<{
  [propName: string]: unknown;
  ref?: Ref<MediaElement> | undefined;
}>;

export type WithMediaProps = {
  [propName: string]: unknown;
  children?: ReactNode | undefined;
  ref?: ForwardedRef<MediaElement>;
};

export function withMedia(WrappedMedia: WrappedMedia): unknown {
  const hoc = ({ children, ref: _ref, ...props }: WithMediaProps) => {
    const [ref, setRef] = useState<MediaElement | null>(null);

    useEffect(() => {
      if (isFunction(_ref)) {
        _ref(ref);
      } else if (_ref) {
        _ref.current = ref;
      }
    }, [ref]);

    return (
      <MediaElementContext.Provider value={ref}>
        <WrappedMedia {...props} ref={setRef}>
          {children}
        </WrappedMedia>
      </MediaElementContext.Provider>
    );
  };

  hoc.displayName = 'WithMediaHOC';
  return hoc;
}
