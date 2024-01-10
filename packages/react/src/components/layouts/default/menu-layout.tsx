import * as React from 'react';

import { isArray } from 'maverick.js/std';

import * as Menu from '../../ui/menu';
import { DefaultLayoutContext } from './context';
import type { DefaultLayoutIcon } from './icons';

/* -------------------------------------------------------------------------------------------------
 * DefaultSubmenuButton
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultSubmenuButtonProps {
  label: string;
  hint?: string;
  disabled?: boolean;
  Icon?: DefaultLayoutIcon;
}

function DefaultSubmenuButton({
  label,
  hint = '',
  Icon,
  disabled = false,
}: DefaultSubmenuButtonProps) {
  const { Icons } = React.useContext(DefaultLayoutContext);
  return (
    <Menu.Button className="vds-menu-button" disabled={disabled}>
      <Icons.Menu.ArrowLeft className="vds-menu-button-close-icon vds-icon" />
      {Icon ? <Icon className="vds-menu-button-icon" /> : null}
      <span className="vds-menu-button-label">{label}</span>
      <span className="vds-menu-button-hint">{hint}</span>
      <Icons.Menu.ArrowRight className="vds-menu-button-open-icon vds-icon" />
    </Menu.Button>
  );
}

DefaultSubmenuButton.displayName = 'DefaultSubmenuButton';
export { DefaultSubmenuButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMenuRadioGroupProps {
  value: string;
  options: { label: string; value: string }[];
  onChange?(newValue: string): void;
}

function DefaultMenuRadioGroup({ value, options, onChange }: DefaultMenuRadioGroupProps) {
  return (
    <Menu.RadioGroup className="vds-radio-group" value={value} onChange={onChange}>
      {options.map((option) => (
        <Menu.Radio className="vds-radio" value={option.value} key={option.value}>
          <div className="vds-radio-check" />
          <span className="vds-radio-label" data-part="label">
            {option.label}
          </span>
        </Menu.Radio>
      ))}
    </Menu.RadioGroup>
  );
}

DefaultMenuRadioGroup.displayName = 'DefaultMenuRadioGroup';
export { DefaultMenuRadioGroup };

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

export function createRadioOptions(
  entries: string[] | Record<string, string>,
): { label: string; value: string }[] {
  return React.useMemo(
    () =>
      isArray(entries)
        ? entries.map((entry) => ({ label: entry, value: entry.toLowerCase() }))
        : Object.keys(entries).map((label) => ({ label, value: entries[label] })),
    [entries],
  );
}
