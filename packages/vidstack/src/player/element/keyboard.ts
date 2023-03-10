import { effect, onDispose, signal, Signals } from 'maverick.js';
import { CustomElementHost, onAttach } from 'maverick.js/element';
import { DOMEvent, isKeyboardClick, listenEvent } from 'maverick.js/std';

import { MediaContext, useMedia } from '../media/context';
import type { MediaKeyShortcuts } from '../media/types';
import type { MediaPlayerProps } from './types';

export const MEDIA_KEY_SHORTCUTS: MediaKeyShortcuts = {
  togglePaused: 'k Space',
  toggleMuted: 'm',
  toggleFullscreen: 'f',
  togglePictureInPicture: 'i',
  seekBackward: 'ArrowLeft',
  seekForward: 'ArrowRight',
  volumeUp: 'ArrowUp',
  volumeDown: 'ArrowDown',
};

const MODIFIER_KEYS = new Set(['Shift', 'Alt', 'Meta', 'Control']),
  BUTTON_SELECTORS = 'button, [role="button"]',
  IGNORE_SELECTORS = 'video, input, textarea, select, [contenteditable], [role^="menuitem"]';

export function useKeyboard(
  { $player, $store: $media, ariaKeys, remote }: MediaContext,
  { $keyShortcuts, $keyDisabled, $keyTarget }: Signals<MediaPlayerProps>,
) {
  effect(() => {
    const player = $player();
    if (!player || $keyDisabled()) return;

    const target = $keyTarget() === 'player' ? player : document,
      $active = signal(false);

    if (target === player) {
      listenEvent(player, 'focusin', () => $active.set(true));
      listenEvent(player, 'focusout', (event) => {
        if (!player.contains(event.target as Node)) $active.set(false);
      });
    } else {
      listenEvent(document, 'focusin', (event) => {
        const activePlayer = event
          .composedPath()
          .find((el) => el instanceof Element && el.localName === 'media-player');
        if (activePlayer !== undefined) $active.set(player === activePlayer);
      });
    }

    effect(() => {
      if (!$active()) return;
      listenEvent(target, 'keyup', onKeyUp);
      listenEvent(target, 'keydown', onKeyDown);
    });

    let seekTotal;
    function calcSeekAmount(event: KeyboardEvent, type: string) {
      const seekBy = event.shiftKey ? 10 : 5;
      return (seekTotal = Math.max(
        0,
        Math.min(
          (seekTotal ?? $media.currentTime) + (type === 'seekForward' ? +seekBy : -seekBy),
          $media.duration,
        ),
      ));
    }

    let timeSlider: Element | null = null;
    function forwardTimeKeyEvent(event: KeyboardEvent) {
      timeSlider?.dispatchEvent(new DOMEvent<void>(event.type, { trigger: event }));
    }

    function seeking(event: KeyboardEvent, type: string) {
      if (!$media.canSeek) return;
      if (!timeSlider) timeSlider = player!.querySelector('media-time-slider');
      if (timeSlider) {
        forwardTimeKeyEvent(event);
      } else {
        remote.seeking(calcSeekAmount(event, type), event);
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      const focused = document.activeElement,
        sliderFocused = focused?.hasAttribute('data-media-slider');

      if (!event.key || !$media.canSeek || sliderFocused || focused?.matches(IGNORE_SELECTORS)) {
        return;
      }

      const method = getMatchingMethod(event);

      if (method?.startsWith('seek')) {
        event.preventDefault();
        if (timeSlider) {
          forwardTimeKeyEvent(event);
          timeSlider = null;
        } else {
          remote.seek(calcSeekAmount(event, method), event);
          seekTotal = 0;
        }
      }

      if (method?.startsWith('volume')) {
        const volumeSlider = player!.querySelector('media-volume-slider');
        volumeSlider?.dispatchEvent(new DOMEvent<void>('keyup', { trigger: event }));
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!event.key || MODIFIER_KEYS.has(event.key)) return;

      const focused = document.activeElement;

      if (
        focused?.matches(IGNORE_SELECTORS) ||
        (isKeyboardClick(event) && focused?.matches(BUTTON_SELECTORS))
      ) {
        return;
      }

      const sliderFocused = focused?.hasAttribute('data-media-slider'),
        method = getMatchingMethod(event);

      if (!method && /[0-9]/.test(event.key) && !sliderFocused) {
        event.preventDefault();
        remote.seek(($media.duration / 10) * Number(event.key), event);
        return;
      }

      if (!method || (/volume|seek/.test(method) && sliderFocused)) return;

      event.preventDefault();

      switch (method) {
        case 'seekForward':
        case 'seekBackward':
          seeking(event, method);
          break;
        case 'volumeUp':
        case 'volumeDown':
          const volumeSlider = player!.querySelector('media-volume-slider');
          if (volumeSlider) {
            volumeSlider.dispatchEvent(new DOMEvent<void>('keydown', { trigger: event }));
          } else {
            const value = event.shiftKey ? 0.1 : 0.05;
            remote.changeVolume($media.volume + (method === 'volumeUp' ? +value : -value), event);
          }
          break;
        case 'toggleFullscreen':
          remote.toggleFullscreen('prefer-media', event);
        default:
          remote[method]?.(event);
      }
    }

    function getMatchingMethod(event: KeyboardEvent) {
      const keyShortcuts = { ...$keyShortcuts(), ...ariaKeys };
      return Object.keys(keyShortcuts).find((method) =>
        keyShortcuts[method].split(' ').some((keys) =>
          replaceSymbolKeys(keys)
            .replace(/Control/g, 'Ctrl')
            .split('+')
            .every((key) =>
              MODIFIER_KEYS.has(key)
                ? event[key.toLowerCase() + 'Key']
                : event.key === key.replace('Space', ' '),
            ),
        ),
      ) as keyof MediaKeyShortcuts | undefined;
    }
  });
}

export function useARIAKeyShortcuts(host: CustomElementHost, shortcut: keyof MediaKeyShortcuts) {
  onAttach(() => {
    const { $keyShortcuts, ariaKeys } = useMedia(),
      keys = host.el!.getAttribute('aria-keyshortcuts');

    if (keys) {
      ariaKeys[shortcut] = keys;

      if (!__SERVER__) {
        onDispose(() => {
          delete ariaKeys[shortcut];
        });
      }

      return;
    }

    const shortcuts = $keyShortcuts()[shortcut];
    if (shortcuts) host.el!.setAttribute('aria-keyshortcuts', shortcuts);
  });
}

const SYMBOL_KEY_MAP = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
function replaceSymbolKeys(key: string) {
  return key.replace(/Shift\+(\d)/g, (_, num) => SYMBOL_KEY_MAP[num - 1]);
}
