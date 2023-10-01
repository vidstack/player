import * as React from 'react';

import { DefaultLayoutContext } from './context';
import { DefaultChaptersMenu, DefaultSettingsMenu } from './shared-layout';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioMenus
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioMenus() {
  const { isSmallLayout, noModal } = React.useContext(DefaultLayoutContext),
    placement = noModal ? 'top end' : !isSmallLayout ? 'top end' : null;
  return (
    <>
      <DefaultChaptersMenu tooltip="top" placement={placement} portalClass="vds-audio-layout" />
      <DefaultSettingsMenu tooltip="top end" placement={placement} portalClass="vds-audio-layout" />
    </>
  );
}

DefaultAudioMenus.displayName = 'DefaultAudioMenus';
export { DefaultAudioMenus };
