import { html } from 'lit-html';
import { effect, peek, signal, type ReadSignal } from 'maverick.js';
import { isKeyboardClick } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../../components/layouts/default/context';
import type { DefaultLayoutWord } from '../../../../../../../components/layouts/default/translations';
import { $ariaBool } from '../../../../../../../utils/aria';
import { $signal } from '../../../../../../lit/directives/signal';
import { $i18n } from '../../utils';

export function DefaultMenuCheckbox({
  label,
  checked,
  defaultChecked = false,
  storageKey,
  onChange,
}: {
  label: string;
  storageKey?: string;
  checked?: ReadSignal<boolean>;
  defaultChecked?: boolean;
  onChange(checked: boolean, trigger?: Event): void;
}) {
  const { translations } = useDefaultLayoutContext(),
    savedValue = storageKey ? localStorage.getItem(storageKey) : null,
    $checked = signal(!!(savedValue ?? defaultChecked)),
    $active = signal(false),
    $ariaChecked = $signal($ariaBool($checked)),
    $label = $i18n(translations, label as DefaultLayoutWord);

  if (storageKey) onChange(peek($checked));

  if (checked) {
    effect(() => void $checked.set(checked()));
  }

  function onPress(event?: PointerEvent) {
    if (event?.button === 1) return;
    $checked.set((checked) => !checked);
    if (storageKey) localStorage.setItem(storageKey, $checked() ? '1' : '');
    onChange($checked(), event);
    $active.set(false);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (isKeyboardClick(event)) onPress();
  }

  function onActive(event: PointerEvent) {
    if (event.button !== 0) return;
    $active.set(true);
  }

  return html`
    <div
      class="vds-menu-checkbox"
      role="menuitemcheckbox"
      tabindex="0"
      aria-label=${$label}
      aria-checked=${$ariaChecked}
      data-active=${$signal(() => ($active() ? '' : null))}
      @pointerup=${onPress}
      @pointerdown=${onActive}
      @keydown=${onKeyDown}
    ></div>
  `;
}
