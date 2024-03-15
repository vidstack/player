import * as React from 'react';

import { isBoolean, isKeyboardClick } from 'maverick.js/std';

export interface DefaultMenuCheckboxProps {
  label: string;
  checked?: boolean;
  storageKey?: string;
  defaultChecked?: boolean;
  onChange?(checked: boolean, trigger?: Event): void;
}

function DefaultMenuCheckbox({
  label,
  checked,
  storageKey,
  defaultChecked = false,
  onChange,
}: DefaultMenuCheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(defaultChecked),
    [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    const savedValue = storageKey ? localStorage.getItem(storageKey) : null,
      checked = !!(savedValue ?? defaultChecked);
    setIsChecked(checked);
    onChange?.(checked);
  }, []);

  React.useEffect(() => {
    if (isBoolean(checked)) setIsChecked(checked);
  }, [checked]);

  function onPress(event?: React.PointerEvent | React.KeyboardEvent) {
    if (event && 'button' in event && event?.button === 1) return;

    const toggledCheck = !isChecked;

    setIsChecked(toggledCheck);
    if (storageKey) localStorage.setItem(storageKey, toggledCheck ? '1' : '');

    onChange?.(toggledCheck, event?.nativeEvent);

    setIsActive(false);
  }

  function onActive(event: React.PointerEvent) {
    if (event.button !== 0) return;
    setIsActive(true);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (isKeyboardClick(event.nativeEvent)) onPress();
  }

  return (
    <div
      className="vds-menu-checkbox"
      role="menuitemcheckbox"
      tabIndex={0}
      aria-label={label}
      aria-checked={isChecked ? 'true' : 'false'}
      data-active={isActive ? '' : null}
      onPointerUp={onPress}
      onPointerDown={onActive}
      onKeyDown={onKeyDown}
    />
  );
}

DefaultMenuCheckbox.displayName = 'DefaultMenuCheckbox';
export { DefaultMenuCheckbox };
