import { effect, ReadSignal } from 'maverick.js';
import { CustomElementHost, onAttach } from 'maverick.js/element';
import {
  ariaBool,
  isKeyboardClick,
  isKeyboardEvent,
  listenEvent,
  setAttribute,
} from 'maverick.js/std';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import type { ToggleButtonElement, ToggleButtonMembers, ToggleButtonProps } from './types';

export function useToggleButton(
  host: CustomElementHost<ToggleButtonElement>,
  $target: ReadSignal<ToggleButtonElement | null>,
  $pressed: ReadSignal<boolean>,
  { $props, ...props }: UseToggleButtonProps,
): ToggleButtonMembers {
  onAttach(() => {
    setAttributeIfEmpty(host.el!, 'tabindex', '0');
    setAttributeIfEmpty(host.el!, 'role', 'button');
    setAttribute(host.el!, 'aria-pressed', () => ariaBool($pressed()));
  });

  useFocusVisible($target);

  effect(() => {
    const target = $target();
    if (!target) return;
    const clickEvents = ['pointerup', 'keydown'] as const;
    for (const eventType of clickEvents) listenEvent(target, eventType, onPress);
  });

  function onPress(event: Event) {
    const disabled = $props.disabled;
    if (disabled || (isKeyboardEvent(event) && !isKeyboardClick(event))) {
      if (disabled) event.stopImmediatePropagation();
      return;
    }

    props.onPress?.(event);
  }

  return {
    get pressed() {
      return $pressed();
    },
    get disabled() {
      return $props.disabled;
    },
  };
}

export interface UseToggleButtonProps {
  $props: ToggleButtonProps;
  onPress?(event: Event): void;
}
