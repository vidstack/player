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
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/audio-menu}
 */
export class AudioRadioGroup extends Component<AudioRadioGroupProps, {}, AudioRadioGroupEvents> {
  static props: AudioRadioGroupProps = {
    emptyLabel: 'Default',
  };

  private _menu?: MenuContext;
  private _media!: MediaContext;
  private _controller: RadioGroupController;

  @prop
  get value() {
    return this._controller.value;
  }

  @prop
  get disabled() {
    const { audioTracks } = this._media.$state;
    return audioTracks().length === 0;
  }

  constructor() {
    super();
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }

  protected override onSetup(): void {
    this._media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this._menu = useContext(menuContext);
    }
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchValue.bind(this));
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchHintText.bind(this));
  }

  @method
  getOptions(): AudioRadioOption[] {
    const { audioTracks } = this._media.$state;
    return audioTracks().map((track) => ({
      track,
      label: track.label,
      value: track.label.toLowerCase(),
    }));
  }

  private _watchValue() {
    this._controller.value = this._getValue();
  }

  private _watchHintText() {
    const { emptyLabel } = this.$props,
      { audioTrack } = this._media.$state,
      track = audioTrack();

    this._menu?._hint.set(track?.label ?? emptyLabel());
  }

  private _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }

  private _getValue() {
    const { audioTrack } = this._media.$state;
    const track = audioTrack();
    return track ? track.label.toLowerCase() : '';
  }

  private _onValueChange(value: string, trigger?: Event) {
    if (this.disabled) return;

    const index = this._media.audioTracks
      .toArray()
      .findIndex((track) => track.label.toLowerCase() === value);

    if (index >= 0) {
      const track = this._media.audioTracks[index]!;
      this._media.remote.changeAudioTrack(index, trigger);
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
