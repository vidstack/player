import { event } from '@wcom/events';
import {
  CSSResultArray,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';

import { FocusMixin } from '../../../shared/directives/FocusMixin';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { currentSafariVersion } from '../../../utils/support';
import { sliderStyles } from './slider.css';
import { SliderValueChangeEvent } from './slider.events';

/**
 * DOCUMENTATION
 */
export class Slider extends FocusMixin(LitElement) {
  static get styles(): CSSResultArray {
    return [sliderStyles];
  }

  /**
   * **ARIA** The `aria-label` property of the slider.
   */
  @property() label?: string;

  /**
   * A number that specifies the granularity that the value must adhere to.
   */
  @property({ type: Number, reflect: true }) step = 1;

  /**
   * The lowest value in the range of permitted values.
   */
  @property({ type: Number, reflect: true }) min = 0;

  /**
   * The greatest value in the range of permitted values.
   */
  @property({ type: Number, reflect: true }) max = 10;

  /**
   * Whether the slider should be hidden.
   */
  @property({ type: Boolean, reflect: true }) hidden = false;

  /**
   * Whether the slider should be disabled (not-interactable).
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The current value.
   */
  @property({ type: Number }) value = 5;

  /**
   * **ARIA** Human-readable text alternative for the current value. Defaults to
   * `value:max` ratio as a percentage.
   */
  @property({ attribute: 'value-text' }) valueText?: string;

  /**
   * **ARIA** Indicates the orientation of the slider.
   */
  @property() orientation: 'horizontal' | 'vertical' = 'horizontal';

  createRenderRoot(): ShadowRoot {
    return this.attachShadow({
      mode: 'open',
      // See Control for more information.
      delegatesFocus: currentSafariVersion() <= 537,
    });
  }

  render(): TemplateResult {
    return html`
      <div part="${this.getRootPartAttr()}" style="${this.getRootStyleAttr()}">
        ${this.renderInput()}
        <slot></slot>
      </div>
    `;
  }

  protected getRootPartAttr(): string {
    return 'root';
  }

  protected getRootStyleAttr(): string {
    return `--vds-slider-value: ${this.getDefaultValueAsText()};`;
  }

  protected renderInput(): TemplateResult {
    return html`
      <input
        part="${this.getInputPartAttr()}"
        type="range"
        step="${this.step}"
        min="${this.min}"
        max="${this.max}"
        value="${this.value}"
        autocomplete="off"
        aria-label="${ifNonEmpty(this.label)}"
        aria-valuemin="${this.min}"
        aria-valuemax="${this.max}"
        aria-valuenow="${this.value}"
        aria-valuetext="${this.valueText ?? this.getDefaultValueAsText()}"
        aria-orientation="${this.orientation}"
        ?disabled="${this.disabled}"
        ?hidden="${this.hidden}"
        @input="${this.handleValueChange}"
        @touchstart="${this.handleTouch}"
        @touchmove="${this.handleTouch}"
        @touchend="${this.handleTouch}"
      />
    `;
  }

  protected getInputPartAttr(): string {
    return 'input';
  }

  protected getDefaultValueAsText(): string {
    return `${(this.value / this.max) * 100}%`;
  }

  protected handleValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input?.value);

    this.dispatchEvent(
      new SliderValueChangeEvent({
        detail: value,
        originalEvent: event,
      }),
    );
  }

  /**
   * Basically input[range="type"] on touch devices sucks (particularly iOS), so this helps make it
   * better.
   *
   * @link https://github.com/sampotts/rangetouch
   */
  protected handleTouch(event: TouchEvent): void {
    const input = event.target as HTMLInputElement;

    if (this.disabled) return;
    event.preventDefault();

    const touchedValue = this.calcTouchedValue(event);

    this.value = touchedValue;

    this.dispatchEvent(
      new SliderValueChangeEvent({
        detail: touchedValue,
        originalEvent: event,
      }),
    );

    input.dispatchEvent(
      new window.Event(event.type === 'touchend' ? 'change' : 'input', {
        bubbles: true,
      }),
    );
  }

  protected calcTouchedValue(event: TouchEvent): number {
    const input = event.target as HTMLInputElement;
    const touch = event.changedTouches[0];
    const min = parseFloat(input.getAttribute('min') ?? '0');
    const max = parseFloat(input.getAttribute('max') ?? '0');
    const step = parseFloat(input.getAttribute('step') ?? '0');
    const delta = max - min;

    // Calculate percentage.
    let percent;
    const clientRect = input.getBoundingClientRect();

    const sliderThumbWidth = parseFloat(
      window
        .getComputedStyle(this)
        .getPropertyValue('--vds-slider-thumb-width'),
    );

    const thumbWidth =
      ((100 / clientRect.width) * (sliderThumbWidth / 2)) / 100;

    percent = (100 / clientRect.width) * (touch.clientX - clientRect.left);

    // Don't allow outside bounds.
    percent = Math.max(0, Math.min(percent, 100));

    // Factor in the thumb offset.
    if (percent < 50) {
      percent -= (100 - percent * 2) * thumbWidth;
    } else if (percent > 50) {
      percent += (percent - 50) * 2 * thumbWidth;
    }

    const position = delta * (percent / 100);

    if (step >= 1) {
      return min + Math.round(position / step) * step;
    }

    /**
     * This part differs from original implementation to save space. Only supports 2 decimal
     * places (0.01) as the step.
     */
    return min + parseFloat(position.toFixed(2));
  }

  // -------------------------------------------------------------------------------------------
  // Event Documentation
  //
  // Purely documentation purposes only, it'll be picked up by `@wcom/cli`.
  // -------------------------------------------------------------------------------------------

  /**
   * Emitted when the slider value changes.
   */
  @event({ name: 'vds-slider-value-change' })
  protected sliderValueChangeEvent!: number;
}
