import * as React from 'react';

import { useVideoQualityOptions } from '../../../../../hooks/options/use-video-quality-options';
import { useMediaState } from '../../../../../hooks/use-media-state';
import * as Menu from '../../../../ui/menu';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { slot, type DefaultLayoutMenuSlotName, type Slots } from '../../slots';
import { DefaultMenuButton } from './items/menu-items';

/* -------------------------------------------------------------------------------------------------
 * DefaultQualityMenu
 * -----------------------------------------------------------------------------------------------*/

interface DefaultQualityMenuProps {
  slots?: Slots<DefaultLayoutMenuSlotName>;
}

function DefaultQualityMenu({ slots }: DefaultQualityMenuProps) {
  const { hideQualityBitrate, icons: Icons } = useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Quality'),
    autoText = useDefaultLayoutWord('Auto'),
    $canSetQuality = useMediaState('canSetQuality'),
    $qualities = useMediaState('qualities'),
    options = useVideoQualityOptions({ auto: autoText });

  if (!$canSetQuality || $qualities.length <= 1 || options.disabled) return null;

  return (
    <Menu.Root className="vds-quality-menu vds-menu">
      <DefaultMenuButton label={label} Icon={Icons.Menu.QualityUp} />
      <Menu.Content className="vds-menu-items">
        {slot(slots, 'qualityMenuItemsStart', null)}

        <Menu.RadioGroup
          className="vds-quality-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, bitrateText, select }) => (
            <Menu.Radio
              className="vds-quality-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <Icons.Menu.RadioCheck className="vds-icon" />
              <span className="vds-radio-label">{label}</span>
              {!hideQualityBitrate && bitrateText ? (
                <span className="vds-radio-hint">{bitrateText}</span>
              ) : null}
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>

        {slot(slots, 'qualityMenuItemsEnd', null)}
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultQualityMenu.displayName = 'DefaultQualityMenu';
export { DefaultQualityMenu };
