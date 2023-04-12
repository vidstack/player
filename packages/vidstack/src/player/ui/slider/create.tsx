import {
  effect,
  getScope,
  peek,
  provideContext,
  scoped,
  useContext,
  type ReadSignal,
  type Signals,
} from 'maverick.js';
import { onAttach, type CustomElementHost } from 'maverick.js/element';
import { ariaBool, mergeProperties, noop, setStyle } from 'maverick.js/std';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import { sliderValueFormattersContext } from './format';
import type { SliderProps } from './props';
import { sliderStoreContext, type SliderStore } from './store';
import type { MediaSliderElement, SliderMembers } from './types';
import { useSliderEvents, type SliderEventCallbacks } from './use-events';
import { getClampedValue } from './utils';

/**
 * This hook enables providing a custom built `input[type="range"]` that is cross-browser friendly,
 * ARIA friendly, mouse/touch friendly and easily stylable.
 */
export function createSlider(
  host: CustomElementHost<MediaSliderElement>,
  { $props, readonly, aria, ...callbacks }: SliderInit,
  accessors: () => SliderProps,
): Slider {
  provideContext(sliderStoreContext);
  provideContext(sliderValueFormattersContext);

  const scope = getScope()!,
    $store = useContext(sliderStoreContext),
    $focused = useFocusVisible(host.$el),
    { $disabled, $min, $max, $value, $step } = $props;

  host.setAttributes({
    disabled: $disabled,
    'data-dragging': () => $store.dragging,
    'data-pointing': () => $store.pointing,
    'data-interactive': () => $store.interactive,
    'aria-disabled': () => ariaBool($disabled()),
    'aria-valuemin': aria?.valueMin ?? (() => $store.min),
    'aria-valuemax': aria?.valueMax ?? (() => $store.max),
    'aria-valuenow': aria?.valueNow ?? (() => Math.round($store.value)),
    'aria-valuetext': aria?.valueText ?? (() => round(($store.value / $store.max) * 100, 2) + '%'),
    'data-media-slider': true,
  });

  host.setCSSVars({
    '--slider-fill-rate': () => $store.fillRate,
    '--slider-fill-value': () => $store.value,
    '--slider-fill-percent': () => $store.fillPercent + '%',
    '--slider-pointer-rate': () => $store.pointerRate,
    '--slider-pointer-value': () => $store.pointerValue,
    '--slider-pointer-percent': () => $store.pointerPercent + '%',
  });

  useSliderEvents(host, $props, callbacks, $store);

  onAttach(() => {
    setAttributeIfEmpty(host.el!, 'role', 'slider');
    setAttributeIfEmpty(host.el!, 'tabindex', '0');
    setAttributeIfEmpty(host.el!, 'aria-orientation', 'horizontal');
    setAttributeIfEmpty(host.el!, 'autocomplete', 'off');
  });

  effect(() => {
    $store.focused = $focused();
  });

  effect(() => {
    const target = host.$el();
    if (!target || $disabled()) return;

    const preview = target.querySelector('[slot="preview"]') as HTMLElement;
    if (!preview) return;

    const rect = preview.getBoundingClientRect();
    const styles = {
      '--computed-width': rect.width + 'px',
      '--computed-height': rect.height + 'px',
      '--preview-top':
        'calc(-1 * var(--media-slider-preview-gap, calc(var(--preview-height) - 2px)))',
      '--preview-width': 'var(--media-slider-preview-width, var(--computed-width))',
      '--preview-height': 'var(--media-slider-preview-height, var(--computed-height))',
      '--preview-width-half': 'calc(var(--preview-width) / 2)',
      '--preview-left-clamp': 'max(var(--preview-width-half), var(--slider-pointer-percent))',
      '--preview-right-clamp': 'calc(100% - var(--preview-width-half))',
      '--preview-left': 'min(var(--preview-left-clamp), var(--preview-right-clamp))',
    };

    for (const name of Object.keys(styles)) {
      setStyle(preview, name, styles[name]);
    }

    function onPreviewResize() {
      const rect = preview.getBoundingClientRect();
      setStyle(preview, '--computed-width', rect.width + 'px');
      setStyle(preview, '--computed-height', rect.height + 'px');
    }

    window.requestAnimationFrame(onPreviewResize);
    const observer = new ResizeObserver(onPreviewResize);
    observer.observe(preview);
    return () => observer.disconnect();
  });

  if (!readonly) {
    effect(() => {
      $store.min = $min();
      $store.max = $max();
    });

    effect(() => {
      if (peek(() => $store.dragging)) return;
      $store.value = getClampedValue($store.min, $store.max, $value(), $step());
    });
  }

  effect(() => {
    if (!$disabled()) return;
    $store.dragging = false;
    $store.pointing = false;
  });

  return {
    $store,
    members: mergeProperties(
      accessors(),
      {
        get value() {
          return $store.value;
        },
        set value(value) {
          $store.value = value;
        },
        get $store() {
          return $store;
        },
        state: new Proxy($store, {
          // @ts-expect-error
          set: noop,
        }),
        subscribe: (callback) => scoped(() => effect(() => callback($store)), scope)!,
        $render: () => {
          return (
            <>
              <div part="track"></div>
              <div part="track track-fill"></div>
              <div part="track track-progress"></div>
              <div part="thumb-container">
                <div part="thumb"></div>
              </div>
            </>
          );
        },
      },
      {},
    ),
  };
}

export interface Slider {
  $store: SliderStore;
  members: SliderMembers;
}

export interface SliderInit extends SliderEventCallbacks {
  $props: Signals<SliderProps>;
  readonly?: boolean;
  aria?: {
    valueMin?: number | ReadSignal<number>;
    valueMax?: number | ReadSignal<number>;
    valueNow?: number | ReadSignal<number>;
    valueText?: string | ReadSignal<string>;
  };
}
