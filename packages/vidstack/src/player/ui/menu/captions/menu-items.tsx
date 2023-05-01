import { effect } from 'maverick.js';
import { ComponentInstance, defineElement, type HTMLCustomElement } from 'maverick.js/element';

import { useMedia, type MediaContext } from '../../../core/api/context';
import { isTrackCaptionKind } from '../../../core/tracks/text/text-track';
import { MenuItems, type MenuItemsAPI } from '../menu-items';
import { Radio } from '../radio/radio';
import { RadioGroup, type RadioGroupChangeEvent } from '../radio/radio-group';
import { renderRadioGroup } from '../radio/render';

declare global {
  interface MaverickElements {
    'media-captions-menu-items': MediaCaptionsMenuItemsElement;
  }
}

/**
 * This component displays menu radio options to the user so they can manually change the current
 * captions/subtitles track.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/captions-menu-items}
 * @example
 * ```html
 * <media-menu>
 *   <media-captions-menu-button label="Captions"></media-captions-menu-button>
 *   <media-captions-menu-items></media-captions-menu-items>
 * </media-menu>
 * ```
 */
export class CaptionsMenuItems extends MenuItems<CaptionsMenuItemsAPI> {
  static override el = defineElement<CaptionsMenuItemsAPI>({
    tagName: 'media-captions-menu-items',
    props: {
      offLabel: 'Off',
      radioClass: null,
      radioGroupClass: null,
      radioCheckClass: null,
    },
  });

  static register = [RadioGroup, Radio];

  protected _media!: MediaContext;

  constructor(instance: ComponentInstance<CaptionsMenuItemsAPI>) {
    super(instance);
    this._media = useMedia();
  }

  protected override onConnect() {
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchHintText.bind(this));
  }

  protected _watchHintText() {
    const { offLabel } = this.$props,
      { textTrack } = this._media.$store,
      track = textTrack();
    this._menu._hint.set(
      track && isTrackCaptionKind(track) && track.mode === 'showing' ? track.label : offLabel(),
    );
  }

  protected _watchControllerDisabled() {
    this._menu._disable(this._isDisabled());
  }

  protected _isDisabled() {
    const { textTracks } = this._media.$store;
    return textTracks().length === 0;
  }

  protected _onChange(event: RadioGroupChangeEvent) {
    if (this._isDisabled()) return;

    const radioGroup = event.target;

    const value = radioGroup.value;

    if (value === 'off') {
      const track = this._media.textTracks.selected;

      if (track) {
        const index = this._media.textTracks.toArray().indexOf(track);
        this._media.remote.changeTextTrackMode(index, 'disabled', event);
      }

      return;
    }

    const index = this._media.textTracks
      .toArray()
      .findIndex((track) => track.label.toLowerCase() === value);

    if (index >= 0) this._media.remote.changeTextTrackMode(index, 'showing', event);
  }

  override render() {
    const { offLabel } = this.$props,
      { textTrack, textTracks } = this._media.$store,
      onChange = this._onChange.bind(this);

    const value = () => {
      const track = textTrack();
      return track && isTrackCaptionKind(track) && track.mode === 'showing'
        ? track.label.toLowerCase()
        : 'off';
    };

    const options = () => [
      { label: offLabel(), value: 'off' },
      ...textTracks()
        .filter(isTrackCaptionKind)
        .map((track) => ({
          label: track.label,
          value: track.label.toLowerCase(),
        })),
    ];

    return renderRadioGroup({
      ...this.$props,
      value,
      options,
      onChange,
    });
  }
}

export interface CaptionsMenuItemsAPI extends MenuItemsAPI {
  props: CaptionsMenuItemsProps;
}

export interface CaptionsMenuItemsProps {
  /** The text to display when the captions are turned off. */
  offLabel: string;
  radioGroupClass: string | null;
  radioClass: string | null;
  radioCheckClass: string | null;
}

export interface MediaCaptionsMenuItemsElement extends HTMLCustomElement<CaptionsMenuItems> {}
