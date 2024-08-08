import { Component, effect, hasProvidedContext, method, prop, useContext } from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import type { AudioTrack } from '../../../../core/tracks/audio-tracks';
import { menuContext, type MenuContext } from '../menu-context';
import type { RadioOption } from '../radio/radio';
import { RadioGroupController } from '../radio/radio-group-controller';

/**
 * This component manages audio track radios.
 *
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/audio-radio-group}
 */
export class AudioRadioGroup extends Component<AudioRadioGroupProps, {}, AudioRadioGroupEvents> {
  static props: AudioRadioGroupProps = {
    emptyLabel: 'Default',
  };

  #menu?: MenuContext;
  #media!: MediaContext;
  #controller: RadioGroupController;

  @prop
  get value() {
    return this.#controller.value;
  }

  @prop
  get disabled() {
    const { audioTracks } = this.#media.$state;
    return audioTracks().length <= 1;
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
    effect(this.#watchValue.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
    effect(this.#watchHintText.bind(this));
  }

  @method
  getOptions(): AudioRadioOption[] {
    const { audioTracks } = this.#media.$state;
    return audioTracks().map((track) => ({
      track,
      label: track.label,
      value: track.label.toLowerCase(),
    }));
  }

  #watchValue() {
    this.#controller.value = this.#getValue();
  }

  #watchHintText() {
    const { emptyLabel } = this.$props,
      { audioTrack } = this.#media.$state,
      track = audioTrack();

    this.#menu?.hint.set(track?.label ?? emptyLabel());
  }

  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }

  #getValue() {
    const { audioTrack } = this.#media.$state;
    const track = audioTrack();
    return track ? track.label.toLowerCase() : '';
  }

  #onValueChange(value: string, trigger?: Event) {
    if (this.disabled) return;

    const index = this.#media.audioTracks
      .toArray()
      .findIndex((track) => track.label.toLowerCase() === value);

    if (index >= 0) {
      const track = this.#media.audioTracks[index]!;
      this.#media.remote.changeAudioTrack(index, trigger);
      this.dispatch('change', { detail: track, trigger });
    }
  }
}

export interface AudioRadioGroupProps {
  /** The text to display when the are no audio tracks. */
  emptyLabel: string;
}

export interface AudioRadioGroupEvents {
  change: AudioRadioGroupChangeEvent;
}

export interface AudioRadioOption extends RadioOption {
  track: AudioTrack;
}

/**
 * Fired when the checked radio changes.
 *
 * @detail track
 */
export interface AudioRadioGroupChangeEvent extends DOMEvent<AudioTrack> {
  target: AudioRadioGroup;
}
