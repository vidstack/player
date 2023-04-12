import { effect, type Signals } from 'maverick.js';
import type { CustomElementHost } from 'maverick.js/element';
import {
  createEvent,
  dispatchEvent,
  DOMEvent,
  isDOMEvent,
  isKeyboardEvent,
  listenEvent,
} from 'maverick.js/std';

import { IS_SAFARI } from '../../../utils/support';
import { useMedia } from '../../media/context';
import type {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderDragValueChangeEvent,
  SliderValueChangeEvent,
} from './events';
import type { SliderStore } from './store';
import type { MediaSliderElement, SliderProps } from './types';
import { getValueFromRate } from './utils';

/**
 * The direction to move the thumb, associated with key symbols.
 */
const SliderKeyDirection = {
  Left: -1,
  ArrowLeft: -1,
  Up: 1,
  ArrowUp: 1,
  Right: 1,
  ArrowRight: 1,
  Down: -1,
  ArrowDown: -1,
} as const;

export function useSliderEvents(
  host: CustomElementHost<MediaSliderElement>,
  { $disabled, $step, $keyStep, $shiftKeyMultiplier }: Signals<SliderProps>,
  { onValueChange, onDragStart, onDragValueChange, onDragEnd }: SliderEventCallbacks,
  $store: SliderStore,
) {
  const remote = useMedia().remote;

  effect(() => {
    const target = host.$el();
    if (!target || $disabled()) return;
    listenEvent(target, 'focus', onFocus);
    listenEvent(target, 'pointerenter', onPointerEnter);
    listenEvent(target, 'pointermove', onPointerMove);
    listenEvent(target, 'pointerleave', onPointerLeave);
    listenEvent(target, 'pointerdown', onPointerDown);
    listenEvent(target, 'keydown', onKeyDown);
    listenEvent(target, 'keyup', onKeyUp);
  });

  effect(() => {
    if ($disabled() || !$store.dragging) return;
    listenEvent(document, 'pointerup', onDocumentPointerUp);
    listenEvent(document, 'pointermove', onDocumentPointerMove);
    if (IS_SAFARI) listenEvent(document, 'touchmove', onDocumentTouchMove, { passive: false });
  });

  function onFocus() {
    updatePointerValue($store.value);
  }

  function updateValue(value: number, trigger?: Event) {
    $store.value = Math.max($store.min, Math.min(value, $store.max));

    const event = createEvent(host.el, 'value-change', { detail: $store.value, trigger });
    host.el?.dispatchEvent(event);
    onValueChange?.(event);

    if ($store.dragging) {
      const event = createEvent(host.el, 'drag-value-change', { detail: value, trigger });
      host.el?.dispatchEvent(event);
      onDragValueChange?.(event);
    }
  }

  function updatePointerValue(value: number, trigger?: Event) {
    $store.pointerValue = Math.max($store.min, Math.min(value, $store.max));
    dispatchEvent(host.el, 'pointer-value-change', { detail: value, trigger });
    if ($store.dragging) updateValue(value, trigger);
  }

  function getPointerValue(event: PointerEvent) {
    const thumbClientX = event.clientX;
    const { left: trackLeft, width: trackWidth } = host.el!.getBoundingClientRect();
    const thumbPositionRate = (thumbClientX - trackLeft) / trackWidth;
    return getValueFromRate($store.min, $store.max, thumbPositionRate, $step());
  }

  function onPointerEnter() {
    $store.pointing = true;
  }

  function onPointerMove(event: PointerEvent) {
    // Avoid double updates - use document pointer move.
    if ($store.dragging) return;
    updatePointerValue(getPointerValue(event), event);
  }

  function onPointerLeave(event: PointerEvent) {
    $store.pointing = false;
  }

  function onPointerDown(event: PointerEvent) {
    const value = getPointerValue(event);
    onStartDragging(value, event);
    updatePointerValue(value, event);
  }

  function onStartDragging(value: number, trigger: Event) {
    if ($store.dragging) return;
    $store.dragging = true;
    const dragStartEvent = createEvent(host.el, 'drag-start', { detail: value, trigger });
    host.el?.dispatchEvent(dragStartEvent);
    onDragStart?.(dragStartEvent);
  }

  function onStopDragging(value: number, trigger: Event) {
    if (!$store.dragging) return;
    $store.dragging = false;
    remote.resumeUserIdle(trigger);
    const dragEndEvent = createEvent(host.el, 'drag-start', { detail: value, trigger });
    host.el?.dispatchEvent(dragEndEvent);
    onDragEnd?.(dragEndEvent);
  }

  // -------------------------------------------------------------------------------------------
  // Keyboard Events
  // -------------------------------------------------------------------------------------------

  let lastDownKey: string;
  function onKeyDown(event: DOMEvent<void> | KeyboardEvent) {
    if (isDOMEvent(event)) {
      const trigger = event.trigger;
      if (isKeyboardEvent(trigger)) event = trigger;
      else return;
    }

    const { key } = event;

    if (key === 'Home' || key === 'PageUp') {
      updatePointerValue($store.min, event);
      updateValue($store.min, event);
      return;
    } else if (key === 'End' || key === 'PageDown') {
      updatePointerValue($store.max, event);
      updateValue($store.max, event);
      return;
    } else if (/[0-9]/.test(key)) {
      const value = (($store.max - $store.min) / 10) * Number(key);
      updatePointerValue(value, event);
      updateValue(value, event);
      return;
    }

    const value = getKeyValue(event);
    if (!value) return;

    const repeat = key === lastDownKey;
    if (!$store.dragging && repeat) onStartDragging(value, event);
    updatePointerValue(value, event);
    if (!repeat) updateValue(value, event);
    lastDownKey = key;
  }

  function onKeyUp(event: DOMEvent<void> | KeyboardEvent) {
    if (isDOMEvent(event)) {
      const trigger = event.trigger;
      if (isKeyboardEvent(trigger)) event = trigger;
      else return;
    }

    lastDownKey = '';
    if (!$store.dragging) return;
    const value = getKeyValue(event) ?? $store.value;
    updatePointerValue(value);
    onStopDragging(value, event);
  }

  function getKeyValue(event: KeyboardEvent) {
    const { key, shiftKey } = event,
      isValidKey = Object.keys(SliderKeyDirection).includes(key);

    if (!isValidKey) return;

    const modifiedStep = !shiftKey ? $keyStep() : $keyStep() * $shiftKeyMultiplier(),
      direction = Number(SliderKeyDirection[key]),
      diff = modifiedStep * direction,
      steps = ($store.value + diff) / $step();

    return Number(($step() * steps).toFixed(3));
  }

  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------

  function onDocumentPointerUp(event: PointerEvent) {
    const value = getPointerValue(event);
    updatePointerValue(value, event);
    onStopDragging(value, event);
  }

  function onDocumentTouchMove(event: TouchEvent) {
    event.preventDefault();
  }

  function onDocumentPointerMove(event: PointerEvent) {
    updatePointerValue(getPointerValue(event), event);
  }
}

export interface SliderEventCallbacks {
  onValueChange?(event: SliderValueChangeEvent): void;
  onDragStart?(event: SliderDragStartEvent): void;
  onDragValueChange?(event: SliderDragValueChangeEvent): void;
  onDragEnd?(event: SliderDragEndEvent): void;
}
