import * as React from 'react';

import { isArray } from 'maverick.js/std';

import * as Menu from '../../../../../ui/menu';
import { DefaultLayoutContext, useDefaultLayoutContext } from '../../../context';
import type { DefaultLayoutIcon } from '../../../icons';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuSection
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMenuSectionProps {
  label?: string;
  value?: string;
  children: React.ReactNode;
}

function DefaultMenuSection({ label, value, children }: DefaultMenuSectionProps) {
  const id = React.useId();

  if (!label) {
    return (
      <div className="vds-menu-section">
        <div className="vds-menu-section-body">{children}</div>
      </div>
    );
  }

  return (
    <section className="vds-menu-section" role="group" aria-labelledby={id}>
      <div className="vds-menu-section-title">
        <header id={id}>{label}</header>
        {value ? <div className="vds-menu-section-value">{value}</div> : null}
      </div>
      <div className="vds-menu-section-body">{children}</div>
    </section>
  );
}

DefaultMenuSection.displayName = 'DefaultMenuSection';
export { DefaultMenuSection };

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuButton
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMenuButtonProps {
  label: string;
  hint?: string;
  disabled?: boolean;
  Icon?: DefaultLayoutIcon;
}

function DefaultMenuButton({ label, hint = '', Icon, disabled = false }: DefaultMenuButtonProps) {
  const { icons: Icons } = React.useContext(DefaultLayoutContext);
  return (
    <Menu.Button className="vds-menu-item" disabled={disabled}>
      <Icons.Menu.ArrowLeft className="vds-menu-close-icon vds-icon" />
      {Icon ? <Icon className="vds-menu-item-icon vds-icon" /> : null}
      <span className="vds-menu-item-label">{label}</span>
      <span className="vds-menu-item-hint">{hint}</span>
      <Icons.Menu.ArrowRight className="vds-menu-open-icon vds-icon" />
    </Menu.Button>
  );
}

DefaultMenuButton.displayName = 'DefaultMenuButton';
export { DefaultMenuButton };

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuItem
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMenuItemProps {
  label: string;
  children: React.ReactNode;
}

function DefaultMenuItem({ label, children }: DefaultMenuItemProps) {
  return (
    <div className="vds-menu-item">
      <div className="vds-menu-item-label">{label}</div>
      {children}
    </div>
  );
}

DefaultMenuItem.displayName = 'DefaultMenuItem';
export { DefaultMenuItem };

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuRadioGroup
 * -----------------------------------------------------------------------------------------------*/

export interface DefaultMenuRadioGroupProps {
  value: string;
  options: { label: string; value: string }[];
  onChange?(newValue: string): void;
}

function DefaultMenuRadioGroup({ value, options, onChange }: DefaultMenuRadioGroupProps) {
  const { icons: Icons } = useDefaultLayoutContext();
  return (
    <Menu.RadioGroup className="vds-radio-group" value={value} onChange={onChange}>
      {options.map((option) => (
        <Menu.Radio className="vds-radio" value={option.value} key={option.value}>
          <Icons.Menu.RadioCheck className="vds-icon" />
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
