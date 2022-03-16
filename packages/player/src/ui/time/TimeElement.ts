import { derived, DisposalBin, formatTime, ReadableStore } from '@vidstack/foundation';
import { css, type CSSResultGroup, html, LitElement, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

import { mediaStoreContext } from '../../media';

/**
 * Outputs a media duration (eg: `currentTime`, `duration`, `bufferedAmount`, etc.) value as time
 * formatted text.
 *
 * @tagname vds-time
 * @example
 * ```html
 * <vds-time type="current"></vds-time>
 * ```
 * @example
 * ```html
 * <!-- Remaining time. -->
 * <vds-time type="current" remainder></vds-time>
 * ```
 */
export class TimeElement extends LitElement {
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
      `,
    ];
  }

  protected _disposal = new DisposalBin();

  protected _mediaStoreConsumer = mediaStoreContext.consume(this);
  protected get _mediaStore() {
    return this._mediaStoreConsumer.value;
  }

  @state() protected __seconds = 0;

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The type of media time to track.
   *
   * @default 'current'
   */
  @property() type: 'current' | 'buffered' | 'duration' | 'seekable' = 'current';

  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour.
   *
   * @default false
   * @example `20:30` -> `0:20:35`
   */
  @property({ attribute: 'show-hours', type: Boolean })
  showHours = false;

  /**
   * Whether the hours unit should be padded with zeroes to a length of 2.
   *
   * @default false
   * @example `1:20:03` -> `01:20:03`
   */
  @property({ attribute: 'pad-hours', type: Boolean })
  padHours = false;

  /**
   * Whether to display the remaining time from the current type, until the duration is reached.
   *
   * @default false
   * @example 'duration-currentTime'
   */
  @property({ type: Boolean })
  remainder = false;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override connectedCallback(): void {
    super.connectedCallback();
    this._handleTypeChange();
  }

  protected override update(changedProperties: PropertyValues): void {
    if (changedProperties.has('type') || changedProperties.has('remainder')) {
      this._handleTypeChange();
    }

    super.update(changedProperties);
  }

  override disconnectedCallback(): void {
    this._disposal.empty();
    super.disconnectedCallback();
  }

  protected override render() {
    return html`${this._getFormattedTime()}`;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  protected _handleTypeChange() {
    this._disposal.empty();

    const store = this._getTypeStore();

    const unsub = (this.remainder ? this._createRemainderStore(store) : store).subscribe(
      ($seconds) => {
        this.__seconds = $seconds;
      },
    );

    this._disposal.add(unsub);
  }

  protected _getTypeStore() {
    switch (this.type) {
      case 'buffered':
        return this._mediaStore.bufferedAmount;
      case 'seekable':
        return this._mediaStore.seekableAmount;
      case 'duration':
        return this._mediaStore.duration;
      default:
        return this._mediaStore.currentTime;
    }
  }

  protected _createRemainderStore(secondsStore: ReadableStore<number>) {
    return derived([secondsStore, this._mediaStore.duration], ([$seconds, $duration]) =>
      Math.max(0, $duration - $seconds),
    );
  }

  protected _getFormattedTime(): string {
    return formatTime(this.__seconds, this.padHours, this.showHours);
  }
}
