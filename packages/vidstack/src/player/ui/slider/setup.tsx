import {
  effect,
  getScope,
  peek,
  provideContext,
  scoped,
  signal,
  useContext,
  type ReadSignal,
  type Signals,
} from 'maverick.js';
import { onAttach, onConnect, type CustomElementHost } from 'maverick.js/element';
import { ariaBool, mergeProperties, noop, setStyle } from 'maverick.js/std';

import { useFocusVisible } from '../../../foundation/observers/use-focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import { sliderValueFormattersContext } from './format';
import type { SliderProps } from './props';
import { setupSliderEvents, type SliderEventCallbacks } from './setup-events';
import { sliderStoreContext, type SliderStore } from './store';
import type { MediaSliderElement, SliderMembers } from './types';
import { getClampedValue } from './utils';

/**
 * This hook enables providing a custom built `input[type="range"]` that is cross-browser friendly,
 * ARIA friendly, mouse/touch friendly and easily stylable.
 */
export function setupSlider(
  host: CustomElementHost<MediaSliderElement>,
  { $props, readonly, aria, ...callbacks }: SliderInit,
  accessors: () => SliderProps,
): Slider {
  provideContext(sliderStoreContext);
  provideContext(sliderValueFormattersContext);

  const scope = getScope()!,
    $store = useContext(sliderStoreContext),
    $focused = useFocusVisible(host.$el),
    $orientation = signal(''),
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

  setupSliderEvents(host, { ...$props, $orientation }, callbacks, $store);

  onAttach(() => {
    setAttributeIfEmpty(host.el!, 'role', 'slider');
    setAttributeIfEmpty(host.el!, 'tabindex', '0');
    setAttributeIfEmpty(host.el!, 'aria-orientation', 'horizontal');
    setAttributeIfEmpty(host.el!, 'autocomplete', 'off');
  });

  onConnect(() => {
    const preview = host.el!.querySelector('[slot="preview"]') as HTMLElement,
      orientation = host.el!.getAttribute('aria-orientation') || '';

    $orientation.set(orientation);

    if (!preview) return;

    effect(() => {
      if ($disabled()) return;

      function onPreviewResize() {
        if (!preview) return;
        const rect = preview.getBoundingClientRect();
        setStyle(preview, '--computed-width', rect.width + 'px');
        setStyle(preview, '--computed-height', rect.height + 'px');
      }

      window.requestAnimationFrame(onPreviewResize);
      const observer = new ResizeObserver(onPreviewResize);
      observer.observe(preview);
      return () => observer.disconnect();
    });

    import('./preview').then(({ setupPreviewStyles }) => {
      setupPreviewStyles(preview, orientation);
    });
  });

  effect(() => {
    $store.focused = $focused();
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
