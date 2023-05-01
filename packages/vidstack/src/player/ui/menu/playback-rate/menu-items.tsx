import { effect } from 'maverick.js';
import { ComponentInstance, defineElement, type HTMLCustomElement } from 'maverick.js/element';

import { useMedia, type MediaContext } from '../../../core/api/context';
import { MenuItems, type MenuItemsAPI } from '../menu-items';
import { Radio } from '../radio/radio';
import { RadioGroup, type RadioGroupChangeEvent } from '../radio/radio-group';
import { renderRadioGroup } from '../radio/render';

declare global {
  interface MaverickElements {
    'media-playback-rate-menu-items': MediaPlaybackRateMenuItemsElement;
  }
}

/**
 * This component displays menu radio options to the user so they can manually change the current
 * playback speed.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/playback-rate-menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-playback-rate-menu-button label="Speed"></media-playback-rate-menu-button>
 *   <media-playback-rate-menu-items></media-playback-rate-menu-items>
 * </media-menu>
 * ```
 */
export class PlaybackRateMenuItems extends MenuItems<PlaybackRateMenuAPI> {
  static override el = defineElement<PlaybackRateMenuAPI>({
    tagName: 'media-playback-rate-menu-items',
    props: {
      normalLabel: 'Normal',
      rates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      radioGroupClass: null,
      radioClass: null,
      radioCheckClass: null,
    },
  });

  static register = [RadioGroup, Radio];

  protected _media!: MediaContext;

  constructor(instance: ComponentInstance<PlaybackRateMenuAPI>) {
    super(instance);
    this._media = useMedia();
  }

  protected override onConnect() {
    // TODO: when we add embeds we'll need to manage disabling.
    // effect(this._watchControllerDisabled.bind(this));
    effect(this._watchHintText.bind(this));
  }

  protected _watchHintText() {
    const { normalLabel } = this.$props,
      { playbackRate } = this._media.$store,
      rate = playbackRate();
    this._menu._hint.set(rate === 1 ? normalLabel() : rate + '×');
  }

  protected _onChange(event: RadioGroupChangeEvent) {
    const radioGroup = event.target;
    this._media.remote.changePlaybackRate(+radioGroup.value, event);
  }

  override render() {
    const { rates, normalLabel } = this.$props,
      { playbackRate } = this._media.$store,
      onChange = this._onChange.bind(this);

    const value = () => playbackRate() + '';

    const options = () =>
      rates().map((rate) => ({
        label: rate === 1 ? normalLabel() : rate + '×',
        value: rate + '',
      }));

    return renderRadioGroup({
      ...this.$props,
      value,
      options,
      onChange,
    });
  }
}

export interface PlaybackRateMenuAPI extends MenuItemsAPI {
  props: PlaybackRateMenuProps;
}

export interface PlaybackRateMenuProps {
  /** The playback rate options to be displayed. */
  rates: number[];
  /** The text to display for normal speed (i.e., playback rate of 1). */
  normalLabel: string;
  radioGroupClass: string | null;
  radioClass: string | null;
  radioCheckClass: string | null;
}

export interface MediaPlaybackRateMenuItemsElement
  extends HTMLCustomElement<PlaybackRateMenuItems> {}
