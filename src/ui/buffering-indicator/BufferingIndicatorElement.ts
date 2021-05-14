import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
} from 'lit';
import { property, state } from 'lit/decorators.js';

import { mediaContext } from '../../core';
import { getSlottedChildren, setAttribute } from '../../utils/dom';
import { isNil } from '../../utils/unit';
import { bufferingIndicatorElementStyles } from './buffering-indicator.css';
import {
  VdsBufferingIndicatorHideEvent,
  VdsBufferingIndicatorShowEvent,
} from './buffering-indicator.events';
import { BufferingIndicatorElementProps } from './buffering-indicator.types';

/**
 * Display an indicator when either the provider/media is booting or media playback has
 * stopped because of a lack of temporary data. This component will always render the default
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
export class BufferingIndicatorElement
  extends LitElement
  implements BufferingIndicatorElementProps {
  static get styles(): CSSResultGroup {
    return [bufferingIndicatorElementStyles];
  }

  @state()
  @mediaContext.waiting.consume()
  protected isWaiting = mediaContext.waiting.defaultValue;

  @state()
  @mediaContext.canPlay.consume()
  protected canPlay = mediaContext.canPlay.defaultValue;

  protected defaultSlotEl?: HTMLElement;

  @property({ type: Number })
  delay = 0;

  @property({ type: Boolean, attribute: 'show-while-booting' })
  showWhileBooting = false;

  protected updated(changedProperties: PropertyValues<this>): void {
    this.handleTogglingHiddenAttr();
    super.updated(changedProperties);
  }

  disconnectedCallback(): void {
    window.clearTimeout(this.delayTimeout as number);
    this.delayTimeout = undefined;

    super.disconnectedCallback();

    this.wasPrevHidden = true;
  }

  protected render(): TemplateResult {
    return html`<slot @slotchange=${this.handleDefaultSlotChange}></slot>`;
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
