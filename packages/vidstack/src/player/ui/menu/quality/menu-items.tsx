import { effect } from 'maverick.js';
import { ComponentInstance, defineElement, type HTMLCustomElement } from 'maverick.js/element';

import { useMedia, type MediaContext } from '../../../core/api/context';
import { MenuItems, type MenuItemsAPI } from '../menu-items';
import { Radio } from '../radio/radio';
import { RadioGroup, type RadioGroupChangeEvent } from '../radio/radio-group';
import { renderRadioGroup } from '../radio/render';

declare global {
  interface MaverickElements {
    'media-quality-menu-items': MediaQualityMenuItemsElement;
  }
}

/**
 * This component displays menu radio options to the user so they can manually change the current
 * playback quality.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/quality-menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-quality-menu-button label="Quality"></media-quality-menu-button>
 *   <media-quality-menu-items></media-quality-menu-items>
 * </media-menu>
 * ```
 */
export class QualityMenuItems extends MenuItems<QualityMenuItemsAPI> {
  static override el = defineElement<QualityMenuItemsAPI>({
    tagName: 'media-quality-menu-items',
    props: {
      autoLabel: 'Auto',
      radioGroupClass: null,
      radioClass: null,
      radioCheckClass: null,
    },
  });

  static register = [RadioGroup, Radio];

  protected _media!: MediaContext;

  constructor(instance: ComponentInstance<QualityMenuItemsAPI>) {
    super(instance);
    this._media = useMedia();
  }

  protected override onConnect() {
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchHintText.bind(this));
  }

  protected _watchHintText() {
    const { autoLabel } = this.$props;
    const { autoQuality, quality } = this._media.$store;
    this._menu._hint.set(!autoQuality() && quality() ? quality()!.height + 'p' : autoLabel());
  }

  protected _watchControllerDisabled() {
    const { qualities } = this._media.$store;
    this._menu._disable(qualities().length === 0);
  }

  protected _isDisabled() {
    const { canSetQuality, qualities } = this._media.$store;
    return !canSetQuality() || qualities().length === 0;
  }

  protected _onChange(event: RadioGroupChangeEvent) {
    if (this._isDisabled()) return;

    const radioGroup = event.target;

    if (radioGroup.value === 'auto') {
      this._media.remote.changeQuality(-1, event);
      return;
    }

    const value = +radioGroup.value,
      index = this._media.qualities.toArray().findIndex((quality) => quality.height === value);

    if (index >= 0) this._media.remote.changeQuality(index, event);
  }

  override render() {
    const { autoLabel } = this.$props,
      { quality, qualities, autoQuality } = this._media.$store,
      onChange = this._onChange.bind(this);

    const value = () => (autoQuality() ? 'auto' : (quality()?.height ?? 'auto') + '');

    const options = () => [
      { label: autoLabel(), value: 'auto' },
      ...qualities().map((quality) => ({
        label: quality.height + 'p',
        value: quality.height + '',
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

export interface QualityMenuItemsAPI extends MenuItemsAPI {
  props: QualityMenuItemsProps;
}

export interface QualityMenuItemsProps {
  /** The text to display for the auto quality radio option. */
  autoLabel: string;
  radioGroupClass: string | null;
  radioClass: string | null;
  radioCheckClass: string | null;
}

export interface MediaQualityMenuItemsElement extends HTMLCustomElement<QualityMenuItems> {}
