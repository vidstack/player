import { effect, peek, signal } from 'maverick.js';
import { isKeyboardClick, listenEvent } from 'maverick.js/std';

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
  seekBackward: 'ArrowLeft',
  seekForward: 'ArrowRight',
  volumeUp: 'ArrowUp',
  volumeDown: 'ArrowDown',
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
    const focused = document.activeElement,
      sliderFocused = focused?.classList.contains('vds-slider');

    if (
      !event.key ||
      !this.$state.canSeek() ||
      sliderFocused ||
      focused?.matches(IGNORE_SELECTORS)
    ) {
      return;
    }

    const method = this._getMatchingMethod(event);

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

    const focused = document.activeElement;

    if (
      focused?.matches(IGNORE_SELECTORS) ||
      (isKeyboardClick(event) && focused?.matches(BUTTON_SELECTORS))
    ) {
      return;
    }

    const sliderFocused = focused?.classList.contains('vds-slider'),
      method = this._getMatchingMethod(event);

    if (!method && !event.metaKey && /[0-9]/.test(event.key) && !sliderFocused) {
      event.preventDefault();
      event.stopPropagation();
      this._media.remote.seek((this.$state.duration() / 10) * Number(event.key), event);
      return;
    }

    if (!method || (/volume|seek/.test(method) && sliderFocused)) return;

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
      default:
        this._media.remote[method]?.(event);
    }
  }

  private _onPreventVideoKeys(event: KeyboardEvent) {
    if (isHTMLMediaElement(event.target) && this._getMatchingMethod(event)) {
      event.preventDefault();
    }
  }

  private _getMatchingMethod(event: KeyboardEvent) {
    const keyShortcuts = {
      ...this.$props.keyShortcuts(),
      ...this._media.ariaKeys,
    };

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
