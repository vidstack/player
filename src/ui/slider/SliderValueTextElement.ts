import { css, CSSResultGroup, html, LitElement, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

import { DisposalBin } from '../../base/events';
import { derived, ReadableStore } from '../../base/stores';
import { round } from '../../utils/number';
import { formatTime } from '../../utils/time';
import { sliderStoreContext } from './sliderStore';

/**
 * @tagname vds-slider-value-text
 * @example
 * ```html
 * <vds-slider-value-text
 *   type="current"
 * ></vds-slider-value-text>
 * ```
 * @example
 * ```html
 * <vds-slider-value-text
 *   format="time"
 *   show-hours
 *   pad-hours
 * ></vds-slider-value-text>
 * ```
 * @example
 * ```html
 * <vds-slider-value-text
 *   format="percent"
 *   decimal-places="2"
 * ></vds-slider-value-text>
 * ```
 */
export class SliderValueTextElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: inline-block;
          contain: content;
        }

        :host([hidden]) {
          display: none;
        }
      `
    ];
  }

  protected _disposal = new DisposalBin();

  protected _sliderStoreConsumer = sliderStoreContext.consume(this);
  protected get _sliderStore() {
    return this._sliderStoreConsumer.value;
  }

  @state() protected _value = 0;

  /**
   * Whether to use the slider's current value, or pointer value.
   */
  @property() type: 'current' | 'pointer' = 'current';

  /**
   * Determines how the value is formatted.
   *
   * @default undefined
   */
  @property() format?: 'percent' | 'time';

  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour. Only available if the `format` attribute is set to `time`.
   *
   * @default false
   * @example `20:30` -> `0:20:35`
   */
  @property({ attribute: 'show-hours', type: Boolean })
  showHours = false;

  /**
   * Whether the hours unit should be padded with zeroes to a length of 2. Only available if
   * the `format` attribute is set to `time`.
   *
   * @default false
   * @example `1:20:03` -> `01:20:03`
   */
  @property({ attribute: 'pad-hours', type: Boolean })
  padHours = false;

  /**
   * Round the value when formatted as a percentage to the given number of decimal places. Only
   * available if `format` attribute is `percent`.
   *
   * @default 2
   */
  @property({ attribute: 'decimal-places', type: Number })
  decimalPlaces = 2;

  override connectedCallback(): void {
    super.connectedCallback();
    this._handleTypeChange();
  }

  protected override update(changedProperties: PropertyValues): void {
    if (changedProperties.has('type') || changedProperties.has('format')) {
      this._handleTypeChange();
    }

    super.update(changedProperties);
  }

  override disconnectedCallback(): void {
    this._disposal.empty();
    super.disconnectedCallback();
  }

  protected override render() {
    return html`${this._getValueText()}`;
  }

  protected _handleTypeChange() {
    this._disposal.empty();

    const valueStore =
      this._sliderStore[this.type === 'current' ? 'value' : 'pointerValue'];

    const store =
      this.format === 'percent'
        ? this._createPercentStore(valueStore)
        : valueStore;

    const unsub = store.subscribe(($value) => {
      this._value = $value;
    });

    this._disposal.add(unsub);
  }

  protected _createPercentStore(valueStore: ReadableStore<number>) {
    return derived(
      [valueStore, this._sliderStore.min, this._sliderStore.max],
      ([$value, $min, $max]) => {
        const range = $max - $min;
        return ($value / range) * 100;
      }
    );
  }

  protected _getValueText(): string {
    switch (this.format) {
      case 'percent':
        return this._getPercentFormat();
      case 'time':
        return this._getTimeFormat();
      default:
        return `${this._value}`;
    }
  }

  protected _getPercentFormat(): string {
    return `${round(this._value, this.decimalPlaces)}%`;
  }

  protected _getTimeFormat(): string {
    return formatTime(this._value, this.padHours, this.showHours);
  }
}
