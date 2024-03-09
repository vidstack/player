import {
  Component,
  computed,
  effect,
  hasProvidedContext,
  method,
  peek,
  prop,
  useContext,
  type ReadSignal,
} from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import { sortVideoQualities } from '../../../../core/quality/utils';
import type { VideoQuality } from '../../../../core/quality/video-quality';
import { round } from '../../../../utils/number';
import { menuContext, type MenuContext } from '../menu-context';
import type { RadioOption } from '../radio/radio';
import { RadioGroupController } from '../radio/radio-group-controller';

/**
 * This component manages video quality radios.
 *
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/quality-radio-group}
 */
export class QualityRadioGroup extends Component<
  QualityRadioGroupProps,
  {},
  QualityRadioGroupEvents
> {
  static props: QualityRadioGroupProps = {
    autoLabel: 'Auto',
    hideBitrate: false,
    sort: 'descending',
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
    const { canSetQuality, qualities } = this._media.$state;
    return !canSetQuality() || qualities().length <= 1;
  }

  private _sortedQualities = computed(() => {
    const { sort } = this.$props,
      { qualities } = this._media.$state;
    return sortVideoQualities(qualities(), sort() === 'descending');
  });

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
  getOptions(): QualityRadioOption[] {
    const { autoLabel, hideBitrate } = this.$props;
    return [
      { value: 'auto', label: autoLabel },
      ...this._sortedQualities().map((quality) => {
        const bitrate =
          quality.bitrate && quality.bitrate >= 0
            ? `${round(quality.bitrate / 1000000, 2)} Mbps`
            : null;

        return {
          quality,
          label: quality.height + 'p',
          value: this._getQualityId(quality),
          bitrate: () => (!hideBitrate() ? bitrate : null),
        };
      }),
    ];
  }

  private _watchValue() {
    this._controller.value = this._getValue();
  }

  private _watchHintText() {
    const { autoLabel } = this.$props,
      { autoQuality, quality } = this._media.$state,
      qualityText = quality() ? quality()!.height + 'p' : '';

    this._menu?._hint.set(
      !autoQuality() ? qualityText : autoLabel() + (qualityText ? ` (${qualityText})` : ''),
    );
  }

  private _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }

  private _onValueChange(value: string, trigger?: Event) {
    if (this.disabled) return;

    if (value === 'auto') {
      this._media.remote.changeQuality(-1, trigger);
      this.dispatch('change', { detail: 'auto', trigger });
      return;
    }

    const { qualities } = this._media.$state,
      index = peek(qualities).findIndex((quality) => this._getQualityId(quality) === value);

    if (index >= 0) {
      const quality = peek(qualities)[index];
      this._media.remote.changeQuality(index, trigger);
      this.dispatch('change', { detail: quality, trigger });
    }
  }

  private _getValue() {
    const { quality, autoQuality } = this._media.$state;

    if (autoQuality()) return 'auto';

    const currentQuality = quality();
    return currentQuality ? this._getQualityId(currentQuality) : 'auto';
  }

  private _getQualityId(quality: VideoQuality) {
    return quality.height + '_' + quality.bitrate;
  }
}

export interface QualityRadioGroupProps {
  /** The text to display for the auto quality radio option. */
  autoLabel: string;
  /** Whether the bitrate should _not_ be displayed next to each quality radio option. */
  hideBitrate: boolean;
  /**
   * Specifies how the options should be sorted. The sorting algorithm looks at both the quality
   * resolution and bitrate.
   *
   * - Ascending: 480p, 720p, 720p (higher bitrate), 1080p
   * - Descending: 1080p, 720p (higher bitrate), 720p, 480p
   */
  sort: 'ascending' | 'descending';
}

export interface QualityRadioOption extends RadioOption {
  quality?: VideoQuality;
  bitrate?: ReadSignal<string | null>;
}

export interface QualityRadioGroupEvents {
  change: QualityRadioGroupChangeEvent;
}

/**
 * Fired when the checked radio changes.
 *
 * @detail quality
 */
export interface QualityRadioGroupChangeEvent extends DOMEvent<'auto' | VideoQuality> {
  target: QualityRadioGroup;
}
