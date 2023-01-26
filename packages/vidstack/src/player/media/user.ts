import { computed, effect, peek, ReadSignal, signal } from 'maverick.js';
import { dispatchEvent, listenEvent } from 'maverick.js/std';

import { useMediaStore } from './context';
import type { MediaControllerElement } from './element/controller/types';

const STOP_IDLE_EVENTS = ['pointerup', 'pointermove', 'focus', 'keydown', 'playing'] as const;

export function useMediaUser($target: ReadSignal<MediaControllerElement | null>): UseMediaUser {
  let $media = useMediaStore(),
    idleTimeout: any,
    delay = 2000,
    trigger: Event | undefined,
    $idle = signal(false),
    $userPaused = signal(false),
    $paused = computed(() => $userPaused() || $media.paused);

  effect(() => {
    const target = $target();
    if (!target) return;

    for (const eventType of STOP_IDLE_EVENTS) {
      listenEvent(target, eventType, stopIdling);
    }

    effect(() => {
      window.clearTimeout(idleTimeout);
      const idle = $idle();
      dispatchEvent(target, 'user-idle-change', { detail: idle, trigger });
      trigger = undefined;
    });

    return () => $idle.set(false);
  });

  function stopIdling(event: Event) {
    if (peek($paused)) return;
    if ($idle()) trigger = event;
    $idle.set(false);
    window.clearTimeout(idleTimeout);
    idleTimeout = window.setTimeout(() => $idle.set(!peek($paused)), delay);
  }

  return {
    idle: {
      get idling() {
        return $idle();
      },
      get paused() {
        return $userPaused();
      },
      set paused(paused) {
        $userPaused.set(paused);
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
