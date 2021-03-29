import {
  CSSResultArray,
  html,
  internalProperty,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
} from 'lit-element';

import { playerContext } from '../../core';
import { getSlottedChildren, setAttribute } from '../../utils/dom';
import { isNil } from '../../utils/unit';
import { bufferingIndicatorStyles } from './buffering-indicator.css';
import {
  VdsBufferingIndicatorHideEvent,
  VdsBufferingIndicatorShowEvent,
} from './buffering-indicator.events';
import { BufferingIndicatorProps } from './buffering-indicator.types';

/**
 * Display an indicator when either the provider/media is booting or media playback has
 * stopped because of a lack of temporary day. This component will always render the default
 * `<slot>`, however, a `hidden` attribute will be applied to the slot when it shoud not be visible.
 *
 * ⚠️ **IMPORTANT:** The styling is left to you, it will only apply the `hidden` attribute.
 *
 * @tagname vds-buffering-indicator
 *
 * @slot Used to pass in the content to be displayed while buffering.
 *
 * @example
 * ```html
 * <vds-buffering-indicator show-while-booting delay="500">
 *   <!-- `hidden` attribute will automatically be applied/removed -->
 *   <div hidden>
 *     <!-- ... -->
 *   </div>
 * </vds-buffering-indicator>
 * ```
 */
export class BufferingIndicator
  extends LitElement
  implements BufferingIndicatorProps {
  static get styles(): CSSResultArray {
    return [bufferingIndicatorStyles];
  }

  @internalProperty()
  @playerContext.waiting.consume()
  protected isWaiting = playerContext.waiting.defaultValue;

  @internalProperty()
  @playerContext.canPlay.consume()
  protected canPlay = playerContext.canPlay.defaultValue;

  protected defaultSlotEl?: HTMLElement;

  @property({ type: Number })
  delay = 0;

  @property({ type: Boolean, attribute: 'show-while-booting' })
  showWhileBooting = false;

  render(): TemplateResult {
    return html`<slot @slotchange="${this.handleDefaultSlotChange}"></slot>`;
  }

  updated(changedProps: PropertyValues): void {
    this.handleTogglingHiddenAttr();
    super.updated(changedProps);
  }

  disconnectedCallback(): void {
    window.clearTimeout(this.delayTimeout as number);
    this.delayTimeout = undefined;

    super.disconnectedCallback();

    this.wasPrevHidden = true;
  }

  protected handleDefaultSlotChange(): void {
    this.defaultSlotEl = getSlottedChildren(this)[0] as HTMLElement;
    this.handleTogglingHiddenAttr();
  }

  protected isIndicatorHidden(): boolean {
    return (!this.showWhileBooting || this.canPlay) && !this.isWaiting;
  }

  protected delayTimeout?: unknown;

  protected handleTogglingHiddenAttr(): void {
    window.clearTimeout(this.delayTimeout as number);

    const shouldBeHidden = this.isIndicatorHidden();

    if (shouldBeHidden || this.delay === 0) {
      this.toggleHiddenAttr();
      return;
    }

    this.delayTimeout = setTimeout(() => {
      this.toggleHiddenAttr();
    }, this.delay);
  }

  protected wasPrevHidden = true;

  protected toggleHiddenAttr(): void {
    if (isNil(this.defaultSlotEl)) return;

    const shouldBeHidden = this.isIndicatorHidden();
    setAttribute(this.defaultSlotEl, 'hidden', shouldBeHidden ? '' : undefined);

    const didChange = this.wasPrevHidden !== shouldBeHidden;
    if (didChange) {
      this.dispatchIndicatorChangeEvent();
      this.wasPrevHidden = shouldBeHidden;
    }
  }

  protected dispatchIndicatorChangeEvent(): void {
    const Event = !this.wasPrevHidden
      ? VdsBufferingIndicatorHideEvent
      : VdsBufferingIndicatorShowEvent;

    this.dispatchEvent(new Event());
  }
}
