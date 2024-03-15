import { Component, effect, peek, State, tick } from 'maverick.js';
import { isString, setAttribute, type DOMEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import { setAttributeIfEmpty } from '../../utils/dom';
import { formatSpokenTime } from '../../utils/time';

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/display/announcer}
 */
export class MediaAnnouncer extends Component<
  MediaAnnouncerProps,
  MediaAnnouncerState,
  MediaAnnouncerEvents
> {
  static props: MediaAnnouncerProps = {
    translations: null,
  };

  static state = new State<MediaAnnouncerState>({
    label: null,
    busy: false,
  });

  private _media!: MediaContext;
  private _initializing = false;

  protected override onSetup(): void {
    this._media = useMediaContext();
  }

  protected override onAttach(el: HTMLElement): void {
    // sr-only.
    el.style.display = 'contents';
  }

  protected override onConnect(el: HTMLElement): void {
    el.setAttribute('data-media-announcer', '');

    setAttributeIfEmpty(el, 'role', 'status');
    setAttributeIfEmpty(el, 'aria-live', 'polite');

    const { busy } = this.$state;
    this.setAttributes({
      'aria-busy': () => (busy() ? 'true' : null),
    });

    // Avoid triggering label updates on first run.
    this._initializing = true;

    effect(this._watchPaused.bind(this));
    effect(this._watchVolume.bind(this));
    effect(this._watchCaptions.bind(this));
    effect(this._watchFullscreen.bind(this));
    effect(this._watchPiP.bind(this));
    effect(this._watchSeeking.bind(this));
    effect(this._watchLabel.bind(this));

    tick();
    this._initializing = false;
  }

  private _watchPaused() {
    const { paused } = this._media.$state;
    this._setLabel(!paused() ? 'Play' : 'Pause');
  }

  private _watchFullscreen() {
    const { fullscreen } = this._media.$state;
    this._setLabel(fullscreen() ? 'Enter Fullscreen' : 'Exit Fullscreen');
  }

  private _watchPiP() {
    const { pictureInPicture } = this._media.$state;
    this._setLabel(pictureInPicture() ? 'Enter PiP' : 'Exit PiP');
  }

  private _watchCaptions() {
    const { textTrack } = this._media.$state;
    this._setLabel(textTrack() ? 'Closed-Captions On' : 'Closed-Captions Off');
  }

  private _watchVolume() {
    const { muted, volume, audioGain } = this._media.$state;
    this._setLabel(
      muted() || volume() === 0
        ? 'Mute'
        : `${Math.round(volume() * (audioGain() ?? 1) * 100)}% ${this._translate('Volume')}`,
    );
  }

  private _startedSeekingAt = -1;
  private _seekTimer = -1;
  private _watchSeeking() {
    const { seeking, currentTime } = this._media.$state,
      isSeeking = seeking();

    if (this._startedSeekingAt > 0) {
      window.clearTimeout(this._seekTimer);
      this._seekTimer = window.setTimeout(() => {
        const newTime = peek(currentTime),
          seconds = Math.abs(newTime - this._startedSeekingAt);

        if (seconds >= 1) {
          const isForward = newTime >= this._startedSeekingAt,
            spokenTime = formatSpokenTime(seconds);

          this._setLabel(
            `${this._translate(isForward ? 'Seek Forward' : 'Seek Backward')} ${spokenTime}`,
          );
        }

        this._startedSeekingAt = -1;
        this._seekTimer = -1;
      }, 300);
    } else if (isSeeking) {
      this._startedSeekingAt = peek(currentTime);
    }
  }

  private _translate(word: string | null) {
    const { translations } = this.$props;
    return translations()?.[word || ''] ?? word;
  }

  private _watchLabel() {
    const { label, busy } = this.$state,
      $label = this._translate(label());

    if (this._initializing) return;

    busy.set(true);
    const id = window.setTimeout(() => void busy.set(false), 150);

    this.el && setAttribute(this.el, 'aria-label', $label);

    if (isString($label)) {
      this.dispatch('change', { detail: $label });
    }

    return () => window.clearTimeout(id);
  }

  private _setLabel(word: string | null) {
    const { label } = this.$state;
    label.set(word);
  }
}

export interface MediaAnnouncerProps {
  translations: Partial<MediaAnnouncerTranslations> | null;
}

export interface MediaAnnouncerState {
  label: string | null;
  busy: boolean;
}

export interface MediaAnnouncerEvents {
  change: DOMEvent<string>;
}

export type MediaAnnouncerWord =
  | 'Play'
  | 'Pause'
  | 'Enter Fullscreen'
  | 'Exit Fullscreen'
  | 'Enter PiP'
  | 'Exit PiP'
  | 'Closed-Captions On'
  | 'Closed-Captions Off'
  | 'Mute'
  | 'Volume'
  | 'Seek Forward'
  | 'Seek Backward';

export type MediaAnnouncerTranslations = {
  [word in MediaAnnouncerWord]: string;
};
