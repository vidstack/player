import { type Signals } from 'maverick.js';
import { onAttach, onConnect, type CustomElementHost } from 'maverick.js/element';
import { ariaBool, isKeyboardClick, isKeyboardEvent, listenEvent } from 'maverick.js/std';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import type { MediaToggleButtonElement, ToggleButtonMembers } from './types';

export function useToggleButton(
  host: CustomElementHost<MediaToggleButtonElement>,
  { $props: { $pressed, $disabled }, ...props }: UseToggleButtonProps,
): ToggleButtonMembers {
  host.setAttributes({
    disabled: $disabled,
    'data-pressed': $pressed,
    'aria-pressed': () => ariaBool($pressed()),
    'data-media-button': true,
  });

  useFocusVisible(host.$el);

  onAttach(() => {
    setAttributeIfEmpty(host.el!, 'tabindex', '0');
    setAttributeIfEmpty(host.el!, 'role', 'button');
  });

  onConnect(() => {
    const clickEvents = ['pointerup', 'keydown'] as const;
    for (const eventType of clickEvents) listenEvent(host.el!, eventType, onPress);
  });

  function onPress(event: Event) {
    const disabled = $disabled();

    if (disabled || (isKeyboardEvent(event) && !isKeyboardClick(event))) {
      if (disabled) event.stopImmediatePropagation();

      return;
    }

    event.preventDefault();
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
  $props: Signals<Pick<ToggleButtonMembers, 'disabled' | 'pressed'>>;
  onPress?(event: Event): void;
}
