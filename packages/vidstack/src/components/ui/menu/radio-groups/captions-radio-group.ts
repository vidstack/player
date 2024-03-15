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

  private _media!: MediaContext;
  private _menu?: MenuContext;
  private _controller: RadioGroupController;

  @prop
  get value() {
    return this._controller.value;
  }

  @prop
  get disabled() {
    const { hasCaptions } = this._media.$state;
    return !hasCaptions();
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
    super.onConnect?.(el);
    effect(this._watchValue.bind(this));
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchHintText.bind(this));
  }

  @method
  getOptions(): CaptionsRadioOption[] {
    const { offLabel } = this.$props,
      { textTracks } = this._media.$state;
    return [
      { value: 'off', label: offLabel },
      ...textTracks()
        .filter(isTrackCaptionKind)
        .map((track) => ({
          track,
          label: track.label,
          value: this._getTrackValue(track),
        })),
    ];
  }

  private _watchValue() {
    this._controller.value = this._getValue();
  }

  private _watchHintText() {
    const { offLabel } = this.$props,
      { textTrack } = this._media.$state,
      track = textTrack();
    this._menu?._hint.set(
      track && isTrackCaptionKind(track) && track.mode === 'showing' ? track.label : offLabel(),
    );
  }

  private _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }

  private _getValue() {
    const { textTrack } = this._media.$state,
      track = textTrack();
    return track && isTrackCaptionKind(track) && track.mode === 'showing'
      ? this._getTrackValue(track)
      : 'off';
  }

  private _onValueChange(value: string, trigger?: Event) {
    if (this.disabled) return;

    if (value === 'off') {
      const track = this._media.textTracks.selected;

      if (track) {
        const index = this._media.textTracks.indexOf(track);
        this._media.remote.changeTextTrackMode(index, 'disabled', trigger);
        this.dispatch('change', { detail: null, trigger });
      }

      return;
    }

    const index = this._media.textTracks
      .toArray()
      .findIndex((track) => this._getTrackValue(track) === value);

    if (index >= 0) {
      const track = this._media.textTracks[index]!;
      this._media.remote.changeTextTrackMode(index, 'showing', trigger);
      this.dispatch('change', { detail: track, trigger });
    }
  }

  private _getTrackValue(track: TextTrack) {
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
