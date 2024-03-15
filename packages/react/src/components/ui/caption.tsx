import * as React from 'react';

import type { VTTCue } from 'media-captions';

import { useMediaState } from '../../hooks/use-media-state';
import { Primitive, type PrimitivePropsWithRef } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Caption
 * -----------------------------------------------------------------------------------------------*/

export interface RootProps extends PrimitivePropsWithRef<'div'> {
  children?: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, RootProps>(({ children, ...props }, forwardRef) => {
  return (
    <Primitive.div
      translate="yes"
      aria-live="off"
      aria-atomic="true"
      {...props}
      ref={forwardRef as React.Ref<any>}
    >
      {children}
    </Primitive.div>
  );
});

Root.displayName = 'Caption';
export { Root };

/* -------------------------------------------------------------------------------------------------
 * CaptionText
 * -----------------------------------------------------------------------------------------------*/

export interface TextProps extends PrimitivePropsWithRef<'span'> {}

const Text = React.forwardRef<HTMLElement, TextProps>((props, forwardRef) => {
  const textTrack = useMediaState('textTrack'),
    [activeCue, setActiveCue] = React.useState<VTTCue | undefined>();

  React.useEffect(() => {
    if (!textTrack) return;

    function onCueChange() {
      setActiveCue(textTrack?.activeCues[0]);
    }

    textTrack.addEventListener('cue-change', onCueChange);
    return () => {
      textTrack.removeEventListener('cue-change', onCueChange);
      setActiveCue(undefined);
    };
  }, [textTrack]);

  return (
    <Primitive.span
      {...props}
      data-part="cue"
      dangerouslySetInnerHTML={{
        __html: activeCue?.text || '',
      }}
      ref={forwardRef as React.Ref<any>}
    />
  );
});

Text.displayName = 'CaptionText';
export { Text };
