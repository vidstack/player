import { effect, peek, ReadSignal, signal } from 'maverick.js';
import { dispatchEvent, listenEvent } from 'maverick.js/std';

import { useMediaStore } from './context';
import type { MediaControllerElement } from './element/controller/types';

const IDLE_EVENTS = ['pointerdown', 'pointermove', 'focus', 'keydown'] as const;

export function useMediaUser($target: ReadSignal<MediaControllerElement | null>): UseMediaUser {
  let $media = useMediaStore(),
    idleTimeout: any,
    delay = 2000,
    trigger: Event | undefined,
    $idle = signal(false),
    $paused = signal(false);

  effect(() => {
    $paused.set($media.paused);
  });

  effect(() => {
    const target = $target();
    if (!target) return;

    for (const eventType of IDLE_EVENTS) {
      listenEvent(target, eventType, handleIdleChange);
    }

    effect(() => {
      if ($paused()) {
        trigger = undefined;
        $idle.set(true);
      }
    });

    effect(() => {
      const idle = $idle();
      window.clearTimeout(idleTimeout);
      dispatchEvent(target, 'user-idle-change', {
        detail: idle,
        trigger,
      });
      trigger = undefined;
    });

    return () => {
      trigger = undefined;
      $idle.set(true);
    };
  });

  function handleIdleChange(event: Event) {
    if (peek($paused)) return;
    $idle.set(true);
    window.clearTimeout(idleTimeout);
    idleTimeout = window.setTimeout(() => {
      trigger = event;
      $idle.set(false);
    }, delay);
  }

  return {
    idle: {
      get idling() {
        return $idle();
      },
      get paused() {
        return $paused();
      },
      set paused(paused) {
        $paused.set(paused);
      },
      get delay() {
        return delay;
      },
      set delay(newDelay) {
        delay = newDelay;
      },
    },
  };
}

export interface UseMediaUser {
  idle: {
    /**
     * Whether the media user is currently idle.
     *
     * @signal
     */
    readonly idling: boolean;
    /**
     * Whether idle state tracking has been paused.
     *
     * @signal
     */
    paused: boolean;
    /**
     * The amount of delay in milliseconds while media playback is progressing without user
     * activity to indicate an idle state.
     *
     * @defaultValue 2000
     */
    delay: number;
  };
}
