import { effect, onDispose, signal, Signals, tick } from 'maverick.js';
import { CustomElementHost, onAttach } from 'maverick.js/element';
import { isKeyboardClick, listenEvent } from 'maverick.js/std';

import { MediaContext, useMedia } from '../media/context';
import type { MediaKeyShortcuts } from '../media/types';
import type { MediaPlayerProps } from './types';

export const MEDIA_KEY_SHORTCUTS: MediaKeyShortcuts = {
  togglePaused: 'k Space',
  toggleMuted: 'm',
  toggleFullscreen: 'f',
  seekBackward: 'ArrowLeft',
  seekForward: 'ArrowRight',
  volumeUp: 'ArrowUp',
  volumeDown: 'ArrowDown',
};

const MODIFIER_KEYS = new Set(['Shift', 'Alt', 'Meta', 'Control']),
  BUTTON_SELECTORS = 'button, [role="button"]',
  IGNORE_SELECTORS = 'input, textarea, select, [contenteditable], [role^="menuitem"]';

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

    let seekTo, seekTimeout, timeSlider;
    function debouncedSeek(event: KeyboardEvent, type: 'seekForward' | 'seekBackward') {
      if (!$media.canSeek) return;
      if (!timeSlider) timeSlider = player!.querySelector('media-time-slider');

      const duration = $media.duration,
        seekBy = event.shiftKey ? 10 : 5;

      seekTo = Math.max(
        0,
        Math.min(
          (seekTo ?? $media.currentTime) + (type === 'seekForward' ? +seekBy : -seekBy),
          duration,
        ),
      );

      const percent = (seekTo / duration) * 100;
      if (timeSlider) {
        timeSlider.$store.pointerValue = percent;
        tick();
        timeSlider.$store.dragging = true;
      }

      window.clearTimeout(seekTimeout);
      remote.seeking(seekTo, event);
      seekTimeout = window.setTimeout(() => {
        remote.seek(seekTo, event);
        timeSlider.$store.value = percent;
        timeSlider.$store.dragging = false;
        timeSlider = null;
        seekTo = null;
      }, 300);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!event.key || MODIFIER_KEYS.has(event.key)) return;

      const focused = document.activeElement;
      if (
        focused?.matches(IGNORE_SELECTORS) ||
        (isKeyboardClick(event) && focused?.matches(BUTTON_SELECTORS))
      ) {
        return;
      }

      const keyShortcuts = { ...$keyShortcuts(), ...ariaKeys };
      const method = Object.keys(keyShortcuts).find((method) =>
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

      const sliderFocused = focused?.hasAttribute('data-media-slider');
      if (!method && /[0-9]/.test(event.key) && !sliderFocused) {
        event.preventDefault();
        remote.seek(($media.duration / 10) * Number(event.key), event);
        return;
      }

      if (!method || (/volume|seek/.test(method) && sliderFocused)) {
        return;
      }

      event.preventDefault();

      switch (method) {
        case 'seekForward':
        case 'seekBackward':
          debouncedSeek(event, method);
          break;
        case 'volumeUp':
        case 'volumeDown':
          const value = event.shiftKey ? 0.1 : 0.05;
          remote.changeVolume($media.volume + (method === 'volumeUp' ? +value : -value), event);
          break;
        case 'toggleFullscreen':
          remote.toggleFullscreen('prefer-media', event);
        default:
          remote[method]?.(event);
      }
    }

    effect(() => {
      if (!$active()) return;
      listenEvent(target, 'keydown', handleKeyDown);
    });
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
