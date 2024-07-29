import { Component, effect, hasProvidedContext, method, prop, useContext } from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import { isTrackCaptionKind, TextTrack } from '../../../../core/tracks/text/text-track';
import { menuContext, type MenuContext } from '../menu-context';
import type { RadioOption } from '../radio/radio';
import { RadioGroupController } from '../radio/radio-group-controller';

/**
 * This component manages caption/subtitle track radio options.
 *
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/captions-radio-group}
 */
export class CaptionsRadioGroup extends Component<
  CaptionsRadioGroupProps,
  {},
  CaptionsRadioGroupEvents
> {
  static props: CaptionsRadioGroupProps = {
    offLabel: 'Off',
  };

  #media!: MediaContext;
  #menu?: MenuContext;
  #controller: RadioGroupController;

  @prop
  get value() {
    return this.#controller.value;
  }

  @prop
  get disabled() {
    const { hasCaptions } = this.#media.$state;
    return !hasCaptions();
  }

  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.#menu = useContext(menuContext);
    }
  }

  protected override onConnect(el: HTMLElement) {
    super.onConnect?.(el);
    effect(this.#watchValue.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
    effect(this.#watchHintText.bind(this));
  }

  @method
  getOptions(): CaptionsRadioOption[] {
    const { offLabel } = this.$props,
      { textTracks } = this.#media.$state;
    return [
      { value: 'off', label: offLabel },
      ...textTracks()
        .filter(isTrackCaptionKind)
        .map((track) => ({
          track,
          label: track.label,
          value: this.#getTrackValue(track),
        })),
    ];
  }

  #watchValue() {
    this.#controller.value = this.#getValue();
  }

  #watchHintText() {
    const { offLabel } = this.$props,
      { textTrack } = this.#media.$state,
      track = textTrack();

    this.#menu?.hint.set(
      track && isTrackCaptionKind(track) && track.mode === 'showing' ? track.label : offLabel(),
    );
  }

  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }

  #getValue() {
    const { textTrack } = this.#media.$state,
      track = textTrack();
    return track && isTrackCaptionKind(track) && track.mode === 'showing'
      ? this.#getTrackValue(track)
      : 'off';
  }

  #onValueChange(value: string, trigger?: Event) {
    if (this.disabled) return;

    if (value === 'off') {
      const track = this.#media.textTracks.selected;

      if (track) {
        const index = this.#media.textTracks.indexOf(track);
        this.#media.remote.changeTextTrackMode(index, 'disabled', trigger);
        this.dispatch('change', { detail: null, trigger });
      }

      return;
    }

    const index = this.#media.textTracks
      .toArray()
      .findIndex((track) => this.#getTrackValue(track) === value);

    if (index >= 0) {
      const track = this.#media.textTracks[index]!;
      this.#media.remote.changeTextTrackMode(index, 'showing', trigger);
      this.dispatch('change', { detail: track, trigger });
    }
  }

  #getTrackValue(track: TextTrack) {
    return track.id + ':' + track.kind + '-' + track.label.toLowerCase();
  }
}

export interface CaptionsRadioGroupProps {
  /** The text to display when the captions are turned off. */
  offLabel: string;
}

export interface CaptionsRadioGroupEvents {
  change: CaptionsRadioGroupChangeEvent;
}

export interface CaptionsRadioOption extends RadioOption {
  track?: TextTrack;
}

/**
 * Fired when the checked radio changes. The event detail will be `null` when no track is selected
 * or captions are turned off.
 *
 * @detail track
 */
export interface CaptionsRadioGroupChangeEvent extends DOMEvent<TextTrack | null> {
  target: CaptionsRadioGroup;
}
