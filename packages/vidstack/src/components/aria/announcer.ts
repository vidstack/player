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

  #media!: MediaContext;
  #initializing = false;

  protected override onSetup(): void {
    this.#media = useMediaContext();
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
    this.#initializing = true;

    effect(this.#watchPaused.bind(this));
    effect(this.#watchVolume.bind(this));
    effect(this.#watchCaptions.bind(this));
    effect(this.#watchFullscreen.bind(this));
    effect(this.#watchPiP.bind(this));
    effect(this.#watchSeeking.bind(this));
    effect(this.#watchLabel.bind(this));

    tick();
    this.#initializing = false;
  }

  #watchPaused() {
    const { paused } = this.#media.$state;
    this.#setLabel(!paused() ? 'Play' : 'Pause');
  }

  #watchFullscreen() {
    const { fullscreen } = this.#media.$state;
    this.#setLabel(fullscreen() ? 'Enter Fullscreen' : 'Exit Fullscreen');
  }

  #watchPiP() {
    const { pictureInPicture } = this.#media.$state;
    this.#setLabel(pictureInPicture() ? 'Enter PiP' : 'Exit PiP');
  }

  #watchCaptions() {
    const { textTrack } = this.#media.$state;
    this.#setLabel(textTrack() ? 'Closed-Captions On' : 'Closed-Captions Off');
  }

  #watchVolume() {
    const { muted, volume, audioGain } = this.#media.$state;
    this.#setLabel(
      muted() || volume() === 0
        ? 'Mute'
        : `${Math.round(volume() * (audioGain() ?? 1) * 100)}% ${this.#translate('Volume')}`,
    );
  }

  #startedSeekingAt = -1;
  #seekTimer = -1;
  #watchSeeking() {
    const { seeking, currentTime } = this.#media.$state,
      isSeeking = seeking();

    if (this.#startedSeekingAt > 0) {
      window.clearTimeout(this.#seekTimer);
      this.#seekTimer = window.setTimeout(() => {
        if (!this.scope) return;

        const newTime = peek(currentTime),
          seconds = Math.abs(newTime - this.#startedSeekingAt);

        if (seconds >= 1) {
          const isForward = newTime >= this.#startedSeekingAt,
            spokenTime = formatSpokenTime(seconds);

          this.#setLabel(
            `${this.#translate(isForward ? 'Seek Forward' : 'Seek Backward')} ${spokenTime}`,
          );
        }

        this.#startedSeekingAt = -1;
        this.#seekTimer = -1;
      }, 300);
    } else if (isSeeking) {
      this.#startedSeekingAt = peek(currentTime);
    }
  }

  #translate(word: string | null) {
    const { translations } = this.$props;
    return translations?.()?.[word || ''] ?? word;
  }

  #watchLabel() {
    const { label, busy } = this.$state,
      $label = this.#translate(label());

    if (this.#initializing) return;

    busy.set(true);
    const id = window.setTimeout(() => void busy.set(false), 150);

    this.el && setAttribute(this.el, 'aria-label', $label);

    if (isString($label)) {
      this.dispatch('change', { detail: $label });
    }

    return () => window.clearTimeout(id);
  }

  #setLabel(word: string | null) {
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
