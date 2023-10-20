import { effect, peek, signal } from 'maverick.js';
import { isArray, isKeyboardClick, isString, listenEvent } from 'maverick.js/std';

import { isHTMLMediaElement } from '../../providers/type-check';
import type { MediaContext } from '../api/media-context';
import { MediaPlayerController } from '../api/player-controller';
import type { MediaKeyShortcuts } from './types';

export const MEDIA_KEY_SHORTCUTS: MediaKeyShortcuts = {
  togglePaused: 'k Space',
  toggleMuted: 'm',
  toggleFullscreen: 'f',
  togglePictureInPicture: 'i',
  toggleCaptions: 'c',
  seekBackward: 'j J ArrowLeft',
  seekForward: 'l L ArrowRight',
  volumeUp: 'ArrowUp',
  volumeDown: 'ArrowDown',
  speedUp: '>',
  slowDown: '<',
};

const MODIFIER_KEYS = new Set(['Shift', 'Alt', 'Meta', 'Control']),
  BUTTON_SELECTORS = 'button, [role="button"]',
  IGNORE_SELECTORS = 'input, textarea, select, [contenteditable], [role^="menuitem"]';

export class MediaKeyboardController extends MediaPlayerController {
  constructor(private _media: MediaContext) {
    super();
  }

  protected override onConnect(): void {
    effect(this._onTargetChange.bind(this));
  }

  private _onTargetChange() {
    const { keyDisabled, keyTarget } = this.$props;
    if (keyDisabled()) return;

    const target = keyTarget() === 'player' ? this.el! : document,
      $active = signal(false);

    if (target === this.el) {
      this.listen('focusin', () => $active.set(true));
      this.listen('focusout', (event) => {
        if (!this.el!.contains(event.target as Node)) $active.set(false);
      });
    } else {
      if (!peek($active)) $active.set(document.querySelector('[data-media-player]') === this.el);
      listenEvent(document, 'focusin', (event) => {
        const activePlayer = event
          .composedPath()
          .find((el) => el instanceof Element && el.localName === 'media-player');
        if (activePlayer !== undefined) $active.set(this.el === activePlayer);
      });
    }

    effect(() => {
      if (!$active()) return;
      listenEvent(target, 'keyup', this._onKeyUp.bind(this));
      listenEvent(target, 'keydown', this._onKeyDown.bind(this));
      listenEvent(target, 'keydown', this._onPreventVideoKeys.bind(this), { capture: true });
    });
  }

  private _onKeyUp(event: KeyboardEvent) {
    const focusedEl = document.activeElement;

    if (!event.key || !this.$state.canSeek() || focusedEl?.matches(IGNORE_SELECTORS)) {
      return;
    }

    let { method, value } = this._getMatchingMethod(event);

    if (!isString(value) && !isArray(value)) {
      value?.callback(event);
      return;
    }

    if (method?.startsWith('seek')) {
      event.preventDefault();
      event.stopPropagation();
      if (this._timeSlider) {
        this._forwardTimeKeyboardEvent(event, method === 'seekForward');
        this._timeSlider = null;
      } else {
        this._media.remote.seek(this._seekTotal!, event);
        this._seekTotal = undefined;
      }
    }

    if (method?.startsWith('volume')) {
      const volumeSlider = this.el!.querySelector('[data-media-volume-slider]');
      volumeSlider?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: method === 'volumeUp' ? 'Up' : 'Down',
          shiftKey: event.shiftKey,
          trigger: event,
        } as KeyboardEventInit),
      );
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (!event.key || MODIFIER_KEYS.has(event.key)) return;

    const focusedEl = document.activeElement;

    if (
      focusedEl?.matches(IGNORE_SELECTORS) ||
      (isKeyboardClick(event) && focusedEl?.matches(BUTTON_SELECTORS))
    ) {
      return;
    }

    let { method, value } = this._getMatchingMethod(event);

    if (!isString(value) && !isArray(value)) {
      value?.callback(event);
      return;
    }

    if (!method && !event.metaKey && /[0-9]/.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      this._media.remote.seek((this.$state.duration() / 10) * Number(event.key), event);
      return;
    }

    if (!method) return;

    event.preventDefault();
    event.stopPropagation();

    switch (method) {
      case 'seekForward':
      case 'seekBackward':
        this._seeking(event, method, method === 'seekForward');
        break;
      case 'volumeUp':
      case 'volumeDown':
        const volumeSlider = this.el!.querySelector('[data-media-volume-slider]');
        if (volumeSlider) {
          volumeSlider.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: method === 'volumeUp' ? 'Up' : 'Down',
              shiftKey: event.shiftKey,
              trigger: event,
            } as KeyboardEventInit),
          );
        } else {
          const value = event.shiftKey ? 0.1 : 0.05;
          this._media.remote.changeVolume(
            this.$state.volume() + (method === 'volumeUp' ? +value : -value),
            event,
          );
        }
        break;
      case 'toggleFullscreen':
        this._media.remote.toggleFullscreen('prefer-media', event);
        break;
      case 'speedUp':
      case 'slowDown':
        const playbackRate = this.$state.playbackRate();
        this._media.remote.changePlaybackRate(
          Math.max(0.25, Math.min(2, playbackRate + (method === 'speedUp' ? 0.25 : -0.25))),
          event,
        );
        break;
      default:
        this._media.remote[method]?.(event);
    }
  }

  private _onPreventVideoKeys(event: KeyboardEvent) {
    if (isHTMLMediaElement(event.target) && this._getMatchingMethod(event).method) {
      event.preventDefault();
    }
  }

  private _getMatchingMethod(event: KeyboardEvent) {
    const keyShortcuts = {
      ...this.$props.keyShortcuts(),
      ...this._media.ariaKeys,
    };

    const method = Object.keys(keyShortcuts).find((method) => {
      const value = keyShortcuts[method as keyof typeof keyShortcuts],
        keys = isArray(value) ? value.join(' ') : isString(value) ? value : value?.keys;
      return (isArray(keys) ? keys : keys?.split(' '))?.some((keys) => {
        return replaceSymbolKeys(keys)
          .replace(/Control/g, 'Ctrl')
          .split('+')
          .every((key) =>
            MODIFIER_KEYS.has(key)
              ? event[key.toLowerCase() + 'Key']
              : event.key === key.replace('Space', ' '),
          );
      });
    });

    return {
      method,
      value: method ? keyShortcuts[method] : null,
    };
  }

  private _seekTotal: number | undefined;
  private _calcSeekAmount(event: KeyboardEvent, type: string) {
    const seekBy = event.shiftKey ? 10 : 5;
    return (this._seekTotal = Math.max(
      0,
      Math.min(
        (this._seekTotal ?? this.$state.currentTime()) +
          (type === 'seekForward' ? +seekBy : -seekBy),
        this.$state.duration(),
      ),
    ));
  }

  private _timeSlider: Element | null = null;
  private _forwardTimeKeyboardEvent(event: KeyboardEvent, forward: boolean) {
    this._timeSlider?.dispatchEvent(
      new KeyboardEvent(event.type, {
        key: !forward ? 'Left' : 'Right',
        shiftKey: event.shiftKey,
        trigger: event,
      } as KeyboardEventInit),
    );
  }

  private _seeking(event: KeyboardEvent, type: string, forward: boolean) {
    if (!this.$state.canSeek()) return;
    if (!this._timeSlider) this._timeSlider = this.el!.querySelector('[data-media-time-slider]');
    if (this._timeSlider) {
      this._forwardTimeKeyboardEvent(event, forward);
    } else {
      this._media.remote.seeking(this._calcSeekAmount(event, type), event);
    }
  }
}

const SYMBOL_KEY_MAP = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
function replaceSymbolKeys(key: string) {
  return key.replace(/Shift\+(\d)/g, (_, num) => SYMBOL_KEY_MAP[num - 1]);
}
