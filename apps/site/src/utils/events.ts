import { onDestroy } from 'svelte';

import { mergeFunctions } from './fn';
import { isKeyboardPress } from './keyboard';
import { isFunction } from './unit';

export function listenEvent<
  Target extends EventTarget,
  Events = Target extends Document
    ? DocumentEventMap
    : Target extends Window
    ? WindowEventMap
    : GlobalEventHandlersEventMap,
  Type extends keyof Events = keyof Events,
>(
  target: Target,
  type: Type,
  callback: (event: Events[Type]) => void,
  options?: AddEventListenerOptions,
) {
  target.addEventListener(type as any, callback as any, options);
  return () => target.removeEventListener(type as any, callback as any);
}

export function onPress(
  target: EventTarget,
  handler: (event: PointerEvent | KeyboardEvent) => void,
) {
  return mergeFunctions(
    listenEvent(target, 'pointerup', (event) => {
      if (event.button === 0) handler(event);
    }),
    listenEvent(target, 'keydown', (event) => {
      if (isKeyboardPress(event)) handler(event);
    }),
  );
}

export type DisposeCallback = (() => void) | { destroy?(): void } | null | undefined | false;

export class DisposalBin {
  constructor(private _bin: DisposeCallback[] = []) {
    try {
      onDestroy(this.dispose);
    } catch (e) {
      //
    }
  }

  add(...callbacks: DisposeCallback[]) {
    for (const callback of callbacks) {
      if (callback) this._bin.push(callback);
    }
  }

  dispose = () => {
    this._bin.forEach((fn) => {
      if (isFunction(fn)) fn();
      else if (fn) fn.destroy?.();
    });

    this._bin = [];
  };
}
