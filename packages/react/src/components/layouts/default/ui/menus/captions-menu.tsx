import * as React from 'react';

import { useCaptionOptions } from '../../../../../hooks/options/use-caption-options';
import * as Menu from '../../../../ui/menu';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { DefaultMenuButton } from './items/menu-items';

/* -------------------------------------------------------------------------------------------------
 * DefaultCaptionMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultCaptionMenu() {
  const { icons: Icons } = useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Captions'),
    offText = useDefaultLayoutWord('Off'),
    options = useCaptionOptions({ off: offText }),
    hint = options.selectedTrack?.label ?? offText;

  if (options.disabled) return null;

  return (
    <Menu.Root className="vds-captions-menu vds-menu">
      <DefaultMenuButton
        label={label}
        hint={hint}
        disabled={options.disabled}
        Icon={Icons.Menu.Captions}
      />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup
          className="vds-captions-radio-group vds-radio-group"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Menu.Radio
              className="vds-caption-radio vds-radio"
              value={value}
              onSelect={select}
              key={value}
            >
              <Icons.Menu.RadioCheck className="vds-icon" />
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultCaptionMenu.displayName = 'DefaultCaptionMenu';
export { DefaultCaptionMenu };
