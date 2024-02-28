import * as React from 'react';

import { useMediaState } from '../../../../../hooks/use-media-state';
import * as Menu from '../../../../ui/menu';
import type * as Tooltip from '../../../../ui/tooltip';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { slot, type DefaultLayoutMenuSlotName, type Slots } from '../../slots';
import { DefaultTooltip } from '../tooltip';
import { DefaultAccessibilityMenu } from './accessibility-menu';
import { DefaultAudioMenu } from './audio-menu';
import { DefaultCaptionMenu } from './captions-menu';
import { DefaultPlaybackMenu } from './playback-menu';

export interface DefaultMediaMenuProps {
  tooltip: Tooltip.ContentProps['placement'];
  placement: Menu.ContentProps['placement'];
  portalClass?: string;
  slots?: Slots<DefaultLayoutMenuSlotName>;
}

function DefaultSettingsMenu({ tooltip, placement, portalClass, slots }: DefaultMediaMenuProps) {
  const {
      showMenuDelay,
      icons: Icons,
      isSmallLayout,
      menuGroup,
      noModal,
    } = useDefaultLayoutContext(),
    settingsText = useDefaultLayoutWord('Settings'),
    $viewType = useMediaState('viewType'),
    $offset = !isSmallLayout && menuGroup === 'bottom' && $viewType === 'video' ? 26 : 0;

  const Content = (
    <Menu.Content
      className="vds-settings-menu-items vds-menu-items"
      placement={placement}
      offset={$offset}
    >
      {slot(slots, 'settingsMenuStartItems', null)}
      <DefaultPlaybackMenu />
      <DefaultAccessibilityMenu />
      <DefaultAudioMenu />
      <DefaultCaptionMenu />
      {slot(slots, 'settingsMenuEndItems', null)}
    </Menu.Content>
  );

  return (
    <Menu.Root className="vds-settings-menu vds-menu" showDelay={showMenuDelay}>
      <DefaultTooltip content={settingsText} placement={tooltip}>
        <Menu.Button className="vds-menu-button vds-button" aria-label={settingsText}>
          <Icons.Menu.Settings className="vds-icon vds-rotate-icon" />
        </Menu.Button>
      </DefaultTooltip>
      {noModal || !isSmallLayout ? (
        Content
      ) : (
        <Menu.Portal
          className={portalClass}
          disabled="fullscreen"
          data-size={isSmallLayout ? 'sm' : null}
        >
          {Content}
        </Menu.Portal>
      )}
    </Menu.Root>
  );
}

DefaultSettingsMenu.displayName = 'DefaultSettingsMenu';
export { DefaultSettingsMenu };
