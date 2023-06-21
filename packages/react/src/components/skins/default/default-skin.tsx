import { createReactComponent, useSignal, type ReactElementProps } from 'maverick.js/react';
import * as React from 'react';

import { useMediaState } from '../../../hooks/use-media-state';
import { DefaultSkinInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';
import { AudioDesktopLayout, AudioMobileLayout } from './audio-ui';
import { VideoDesktopLayout, VideoMobileLayout } from './video-ui';

/* -------------------------------------------------------------------------------------------------
 * DefaultSkin
 * -----------------------------------------------------------------------------------------------*/

const DefaultSkinBridge = createReactComponent(DefaultSkinInstance);

export interface DefaultSkinProps extends ReactElementProps<DefaultSkinInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<DefaultSkinInstance>;
}

const DefaultSkin = React.forwardRef<DefaultSkinInstance, DefaultSkinProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <DefaultSkinBridge {...props} ref={forwardRef}>
        {(props, instance) => (
          <Primitive.div className="vds-skin" {...props}>
            <MediaUI instance={instance} />
            {children}
          </Primitive.div>
        )}
      </DefaultSkinBridge>
    );
  },
);

DefaultSkin.displayName = 'DefaultSkin';

/* -------------------------------------------------------------------------------------------------
 * MediaUI
 * -----------------------------------------------------------------------------------------------*/

interface MediaUIProps {
  instance: DefaultSkinInstance;
}

function MediaUI({ instance }: MediaUIProps) {
  const $canLoad = useMediaState('canLoad'),
    $layoutType = useSignal(() => instance.getLayoutType(), instance),
    $isMobile = useSignal(() => instance.isMobile(), instance);

  if (!$canLoad) return null;

  return (
    <div className="vds-media-ui">
      {$layoutType.startsWith('video') ? (
        $isMobile ? (
          <VideoMobileLayout />
        ) : (
          <VideoDesktopLayout />
        )
      ) : $isMobile ? (
        <AudioMobileLayout />
      ) : (
        <AudioDesktopLayout />
      )}
    </div>
  );
}

MediaUI.displayName = 'MediaUI';

export { DefaultSkin };
