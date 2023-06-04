import { computed, effect, peek } from 'maverick.js';
import { ComponentInstance, defineElement, type HTMLCustomElement } from 'maverick.js/element';

import { ClassManager } from '../../../../foundation/observers/class-manager';
import { round } from '../../../../utils/number';
import { useMedia, type MediaContext } from '../../../core/api/context';
import type { VideoQuality } from '../../../core/quality/video-quality';
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
      hideBitrate: false,
      radioGroupClass: null,
      radioClass: null,
      radioCheckClass: null,
    },
  });

  static register = [RadioGroup, Radio];

  protected _media!: MediaContext;

  protected _sortedQualities = computed(() => {
    const { qualities } = this._media.$store;
    return [...qualities()].sort((a, b) =>
      b.height === a.height ? b.bitrate - a.bitrate : b.height - a.height,
    );
  });

  constructor(instance: ComponentInstance<QualityMenuItemsAPI>) {
    super(instance);
    this._media = useMedia();
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchHintText.bind(this));

    const { radioClass, radioCheckClass } = this.$props;
    new ClassManager(el)
      ._observe('media-radio', radioClass)
      ._observe('[part="check"]', radioCheckClass);
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

    const radioGroup = event.target,
      value = radioGroup.value;

    if (value === 'auto') {
      this._media.remote.changeQuality(-1, event);
      return;
    }

    const { qualities } = this._media.$store,
      index = peek(qualities).findIndex((quality) => this._getQualityId(quality) === value);

    if (index >= 0) this._media.remote.changeQuality(index, event);
  }

  protected _getValue() {
    const { quality, autoQuality } = this._media.$store;

    if (autoQuality()) return 'auto';

    const currentQuality = quality();
    return currentQuality ? this._getQualityId(currentQuality) : 'auto';
  }

  protected _getQualityId(quality: VideoQuality) {
    return quality.height + '_' + quality.bitrate;
  }

  protected _getOptions() {
    const { autoLabel, hideBitrate } = this.$props;
    return [
      { value: 'auto', content: () => <span>{autoLabel()}</span> },
      ...this._sortedQualities().map((quality) => {
        const rate = `${round(quality.bitrate / 1000000, 2)} Mbps`;
        return {
          value: this._getQualityId(quality),
          content: () => (
            <>
              <span part="label">{quality.height + 'p'}</span>
              {!hideBitrate() && <span part="info">{rate}</span>}
            </>
          ),
        };
      }),
    ];
  }

  override render() {
    const { radioGroupClass } = this.$props;
    return renderRadioGroup({
      value: this._getValue.bind(this),
      options: this._getOptions.bind(this),
      radioGroupClass,
      onChange: this._onChange.bind(this),
    });
  }
}

export interface QualityMenuItemsAPI extends MenuItemsAPI {
  props: QualityMenuItemsProps;
}

export interface QualityMenuItemsProps {
  /** The text to display for the auto quality radio option. */
  autoLabel: string;
  /** Whether the bitrate should _not_ be displayed next to each quality radio option. */
  hideBitrate: boolean;
  radioGroupClass: string | null;
  radioClass: string | null;
  radioCheckClass: string | null;
}

export interface MediaQualityMenuItemsElement extends HTMLCustomElement<QualityMenuItems> {}
