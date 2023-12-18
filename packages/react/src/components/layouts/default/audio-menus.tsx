import * as React from 'react';

import { DefaultLayoutContext } from './context';
import { DefaultChaptersMenu, DefaultSettingsMenu } from './shared-layout';
import { slot, type DefaultLayoutMenuSlotName, type Slots } from './slots';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioMenus
 * -----------------------------------------------------------------------------------------------*/

function DefaultAudioMenus({ slots }: { slots?: Slots<DefaultLayoutMenuSlotName> }) {
  const { isSmallLayout, noModal } = React.useContext(DefaultLayoutContext),
    placement = noModal ? 'top end' : !isSmallLayout ? 'top end' : null;
  return (
    <>
      {slot(
        slots,
        'chaptersMenu',
        <DefaultChaptersMenu tooltip="top" placement={placement} portalClass="vds-audio-layout" />,
      )}
      {slot(
        slots,
        'settingsMenu',
        <DefaultSettingsMenu
          tooltip="top end"
          placement={placement}
          portalClass="vds-audio-layout"
          slots={slots}
        />,
      )}
    </>
  );
}

DefaultAudioMenus.displayName = 'DefaultAudioMenus';
export { DefaultAudioMenus };
