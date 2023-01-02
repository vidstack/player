import { effect, peek, provideContext, Signals, useContext } from 'maverick.js';
import { CustomElementHost, onAttach } from 'maverick.js/element';
import { ariaBool, mergeProperties } from 'maverick.js/std';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import type { SliderProps } from './props';
import { SliderStore, SliderStoreContext } from './store';
import type { SliderElement, SliderMembers } from './types';
import { useSliderEvents } from './use-events';
import { getClampedValue } from './utils';

/**
 * This hook enables providing a custom built `input[type="range"]` that is cross-browser friendly,
 * ARIA friendly, mouse/touch friendly and easily stylable.
 */
export function useSlider(
  host: CustomElementHost<SliderElement>,
  $props: Signals<SliderProps>,
  accessors: () => SliderProps,
): UseSlider {
  provideContext(SliderStoreContext);

  const $store = useContext(SliderStoreContext),
    { $disabled, $min, $max, $value, $step } = $props;

  host.setAttributes({
    dragging: () => $store.dragging,
    pointing: () => $store.pointing,
    interactive: () => $store.interactive,
    'aria-disabled': () => ariaBool($disabled()),
    'aria-valuemin': () => $store.min,
    'aria-valuemax': () => $store.max,
    'aria-valuenow': () => $store.value,
    'aria-valuetext': () => round(($store.value / $store.max) * 100, 2) + '%',
  });

  host.setCSSVars({
    '--vds-slider-fill-rate': () => $store.fillRate,
    '--vds-slider-fill-value': () => $store.value,
    '--vds-slider-fill-percent': () => $store.fillPercent + '%',
    '--vds-slider-pointer-rate': () => $store.pointerRate,
    '--vds-slider-pointer-value': () => $store.pointerValue,
    '--vds-slider-pointer-percent': () => $store.pointerPercent + '%',
  });

  useFocusVisible(host.$el);
  useSliderEvents(host.$el, $props, $store);

  onAttach(() => {
    setAttributeIfEmpty(host.el!, 'role', 'slider');
    setAttributeIfEmpty(host.el!, 'tabindex', '0');
    setAttributeIfEmpty(host.el!, 'aria-orientation', 'horizontal');
    setAttributeIfEmpty(host.el!, 'autocomplete', 'off');
  });

  effect(() => {
    $store.min = $min();
    $store.max = $max();
  });

  effect(() => {
    if (peek(() => $store.dragging)) return;
    $store.value = getClampedValue($store.min, $store.max, $value(), $step());
  });

  effect(() => {
    if (!$disabled()) return;
    $store.dragging = false;
    $store.pointing = false;
  });

  return {
    $store,
    members: mergeProperties($store, accessors(), {
      get dragging() {
        return $store.dragging;
      },
      get pointing() {
        return $store.pointing;
      },
      get value() {
        return $store.value;
      },
      set value(value) {
        $store.value = value;
      },
    }),
  };
}

export interface UseSlider {
  $store: SliderStore;
  members: SliderMembers;
}
