import { effect, Signals } from 'maverick.js';
import { CustomElementHost, onAttach } from 'maverick.js/element';
import { ariaBool, isKeyboardClick, isKeyboardEvent, listenEvent } from 'maverick.js/std';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import type { ToggleButtonElement, ToggleButtonMembers, ToggleButtonProps } from './types';

export function useToggleButton(
  host: CustomElementHost<ToggleButtonElement>,
  { $props: { $pressed, $disabled }, ...props }: UseToggleButtonProps,
): ToggleButtonMembers {
  host.setAttributes({
    'aria-pressed': () => ariaBool($pressed()),
  });

  useFocusVisible(host.$el);

  onAttach(() => {
    setAttributeIfEmpty(host.el!, 'tabindex', '0');
    setAttributeIfEmpty(host.el!, 'role', 'button');
  });

  effect(() => {
    const target = host.$el();
    if (!target) return;
    const clickEvents = ['pointerup', 'keydown'] as const;
    for (const eventType of clickEvents) listenEvent(target, eventType, onPress);
  });

  function onPress(event: Event) {
    const disabled = $disabled();
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
      return $disabled();
    },
  };
}

export interface UseToggleButtonProps {
  $props: Signals<
    ToggleButtonProps & {
      pressed: boolean;
    }
  >;
  onPress?(event: Event): void;
}
