import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import { provideContextRecord } from '../../../foundation/context/index.js';
import { ifNonEmpty } from '../../../foundation/directives/index.js';
import {
  DiscoveryEvent,
  ElementDiscoveryController,
  VdsElement
} from '../../../foundation/elements/index.js';
import {
  isPointerEvent,
  isVdsEvent,
  VdsCustomEvent
} from '../../../foundation/events/index.js';
import { StorybookControl } from '../../../foundation/storybook/StorybookControl.js';
import { mediaContext } from '../../../media/context.js';
import { getSlottedChildren, raf } from '../../../utils/dom.js';
import { clampNumber, round } from '../../../utils/number.js';
import { rafThrottle } from '../../../utils/timing.js';
import { isNil } from '../../../utils/unit.js';
import { scrubberContext } from '../scrubber/context.js';
import { scrubberPreviewContext } from './context.js';
import {
  ScrubberPreviewHideEvent,
  ScrubberPreviewShowEvent,
  ScrubberPreviewTimeUpdateEvent
} from './events.js';
import { scrubberPreviewElementStyles } from './styles.js';

export const SCRUBBER_PREVIEW_ELEMENT_TAG_NAME = 'vds-scrubber-preview';

/**
 * Fired when the scrubber preview element connects to the DOM.
 *
 * @bubbles
 * @composed
 * @augments {DiscoveryEvent<ScrubberPreviewElement>}
 */
export class ScrubberPreviewConnectEvent extends DiscoveryEvent {
  /** @readonly */
  static TYPE = 'vds-scrubber-preview-connect';
}

/**
 * Plugs in to the `<vds-scrubber>` component to enable media previews. A preview is essentially
 * a sneak peek of a certain time the user is interacting with on the time slider. You might
 * be familiar with this on YouTube when hovering over the scrubber, and seeing a square preview
 * above the timeline displaying an frame/image of the video at that hovered time.
 *
 * This element renders a track for the preview element to run along. There's a track fill
 * element that will fill the track up to the part of the track being interacted with. You can
 * turn this off by setting the `noTrackFill` property or `no-track-fill` attribute.
 *
 * ## Previews
 *
 * You can pass in a preview to be shown while the user is interacting (hover/drag) with the
 * scrubber by passing an element into the `preview` slot, such as `<div slot="preview"></div>`.
 *
 * You need to do the following on your root preview element:
 *
 * - Expect that your root preview element will be positioned absolutely.
 * - Set the `bottom` CSS property on it to adjust it to the desired position above the slider.
 * - Create CSS styles for when it has a hidden attribute (`.preview[hidden] {}`).
 *
 * The Scrubber will automatically do the following to the root preview element passed in:
 *
 * - Set the `position` to `absolute`.
 * - Set a `hidden` attribute when it should be hidden (it's left to you to hide it with CSS).
 * - Update the `translateX()` CSS property to position the preview accordingly.
 *
 * ### How do I get the current preview time?
 *
 * You can either listen to `vds-scrubber-preview-time-update` event on this component, or you can
 * use the `scrubberPreviewContext`.
 *
 * For styling you have access to the `--vds-scrubber-preview-time` CSS property which contains
 * the current time in seconds the user is previewing. There's also the `--vds-media-duration`
 * property if needed.
 *
 * @tagname vds-scrubber-preview
 * @cssprop --vds-scrubber-preview-track-height - The height of the preview track (defaults to `--vds-slider-track-height`).
 * @cssprop --vds-scrubber-preview-track-fill-bg - The background color of the track fill (defaults to `#212121`).
 * @csspart track - The element that acts as a path that the preview travels along.
 * @csspart track-fill - The element that fills the track up to the point being previewed.
 * @slot Used to pass in the element that will be displayed on preview.
 * @slot track - Used to pass content into the track element.
 * @slot track-fill - Used to pass content into the track fill element.
 * @example
 * ```html
 * <vds-scrubber>
 *   <vds-scrubber-preview>
 *     <div class="preview"></div>
 *   </vds-scrubber-preview>
 * </vds-scrubber>
 * ```
 * @example
 * ```css
 * .preview {
 *   bottom: 24px;
 *   opacity: 1;
 *   transition: opacity 0.2s ease-in;
 * }
 *
 * .preview[hidden] {
 *   display: block;
 *   opacity: 0;
 * }
 * ```
 */
export class ScrubberPreviewElement extends VdsElement {
  /**
   * @type {import('lit').CSSResultGroup}
   */
  static get styles() {
    return [scrubberPreviewElementStyles];
  }

  /**
   * @type {string[]}
   */
  static get parts() {
    return ['track', 'track-fill'];
  }

  /**
   * @type {string[]}
   */
  static get events() {
    return [
      ScrubberPreviewShowEvent.TYPE,
      ScrubberPreviewHideEvent.TYPE,
      ScrubberPreviewTimeUpdateEvent.TYPE
    ];
  }

  constructor() {
    super();

    // Properties
    /**
     * Whether the preview is hidden.
     *
     * @type {boolean}
     */
    this.hidden = false;

    /**
     * Whether the preview is disabled.
     *
     * @type {boolean}
     */
    this.disabled = false;

    /**
     * Whether the preview track fill should be NOT be rendered.
     *
     * @type {boolean}
     */
    this.noTrackFill = false;

    /**
     * Whether the preview passed in should NOT be clamped to the host element edges.
     *
     * @type {boolean}
     */
    this.noClamp = false;

    // Context Consumers
    /**
     * @protected
     * @type {number}
     */
    this.mediaDuration = 0;

    /**
     * @protected
     * @type {boolean}
     */
    this.isDragging = scrubberContext.dragging.initialValue;

    /**
     * @protected
     * @type {boolean}
     */
    this.isInteracting = scrubberContext.interacting.initialValue;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   */
  context = provideContextRecord(this, scrubberPreviewContext);

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      // Properties
      hidden: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      noClamp: { type: Boolean, attribute: 'no-clamp' },
      noTrackFill: { type: Boolean, attribute: 'no-track-fill' }
    };
  }

  /** @type {import('../../../foundation/context').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      isDragging: scrubberContext.dragging,
      isInteracting: scrubberContext.interacting,
      mediaDuration: {
        context: mediaContext.duration,
        transform: (d) => (d >= 0 ? d : 0)
      }
    };
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   */
  discoveryController = new ElementDiscoveryController(
    this,
    ScrubberPreviewConnectEvent
  );

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    if (changedProperties.has('mediaDuration')) {
      this.style.setProperty(
        '--vds-media-duration',
        String(this.mediaDuration)
      );
    }

    if (changedProperties.has('hidden') && this.hidden) {
      this.hidePreview();
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this.hidePreview();
    }

    super.update(changedProperties);
  }

  render() {
    return html`${this.renderTrack()}`;
  }

  // -------------------------------------------------------------------------------------------
  // Track Fill
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  trackRef = createRef();

  /**
   * Returns the underlying track element (`<div>`).
   *
   * @type {HTMLDivElement}
   */
  get trackElement() {
    return /** @type {HTMLDivElement} */ (this.trackRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTrack() {
    return html`
      <div
        id="track"
        part=${this.getTrackPartAttr()}
        ?hidden=${this.hidden || this.disabled}
        ${ref(this.trackRef)}
      >
        ${this.renderPreviewSlot()}${this.renderTrackFill()}${this.renderTrackSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getTrackPartAttr() {
    return 'track';
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTrackSlot() {
    return html`<slot name=${this.getTrackSlotName()}></slot>`;
  }

  /**
   * @protected
   * @returns {string}
   */
  getTrackSlotName() {
    return 'track';
  }

  // -------------------------------------------------------------------------------------------
  // Track Fill
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  trackFillRef = createRef();

  /**
   * Returns the underlying track fill element (`<div>`). This will be `undefined` if the
   * `noTrackFill` property or `no-track-fill` attribute is `true`.
   *
   * @type {HTMLDivElement | undefined}
   */
  get trackFillElement() {
    return this.trackFillRef.value;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTrackFill() {
    if (this.noTrackFill) return html``;

    return html`
      <div
        id="track-fill"
        part=${this.getTrackFillPartAttr()}
        ?hidden=${!this.isInteracting}
        ${ref(this.trackFillRef)}
      >
        ${this.renderTrackFillSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getTrackFillPartAttr() {
    return 'track-fill';
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderTrackFillSlot() {
    return html`<slot name=${this.getTrackFillSlotName()}></slot>`;
  }

  /**
   * @protected
   * @returns {string}
   */
  getTrackFillSlotName() {
    return 'track-fill';
  }

  // -------------------------------------------------------------------------------------------
  // Preview
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {HTMLElement | undefined}
   */
  _previewSlotElement;

  /**
   * The element passed in to the `preview` slot.
   *
   * @type {HTMLElement | undefined}
   */
  get previewSlotElement() {
    return this._previewSlotElement;
  }

  /**
   * Whether the current slotted preview element is hidden.
   *
   * @type {boolean}
   */
  get isPreviewHidden() {
    return this.previewSlotElement?.hasAttribute('hidden') ?? true;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderPreviewSlot() {
    return html`
      <slot
        name="${ifNonEmpty(this.getPreviewSlotName())}"
        @slotchange="${this.handlePreviewSlotChange}"
      ></slot>
    `;
  }

  /**
   * @protected
   * @returns {string | undefined}
   */
  getPreviewSlotName() {
    return undefined;
  }

  /**
   * @protected
   */
  handlePreviewSlotChange() {
    this._previewSlotElement = /** @type {HTMLElement} */ (
      getSlottedChildren(this, this.getPreviewSlotName())[0]
    );

    if (!isNil(this.previewSlotElement)) {
      this.previewSlotElement.style.position = 'absolute';
      this.previewSlotElement.style.left = '0';
      this.previewSlotElement.style.willChange = 'transform';
      this.hidePreview();
    }
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {number | undefined}
   */
  showPreviewTimeout;

  /**
   * Show the slotted preview element.
   *
   * @param {Event | undefined} [event] - Original event that triggered this action (if any).
   */
  showPreview(event) {
    window.clearTimeout(this.showPreviewTimeout);

    if (
      isNil(this.previewSlotElement) ||
      this.disabled ||
      !this.isInteracting ||
      (this.isInteracting && !this.isPreviewHidden)
    ) {
      return;
    }

    this.showPreviewTimeout = window.setTimeout(
      async () => {
        this.context.showing = true;
        this.previewSlotElement?.removeAttribute('hidden');

        await raf();

        if (isPointerEvent(event)) {
          await this.updatePreviewPosition(event);
        }

        await this.updateComplete;

        this.setAttribute('previewing', '');
        this.dispatchEvent(
          new ScrubberPreviewShowEvent({ originalEvent: event })
        );
      },
      this.isDragging ? 150 : 0
    );

    this.requestUpdate();
  }

  /**
   * Hide the slotted preview element.
   *
   * @param {Event | undefined} [event] - Original event that triggered this action (if any).
   * @returns {Promise<void>}
   */
  async hidePreview(event) {
    window.clearTimeout(this.showPreviewTimeout);

    if (this.isPreviewHidden) {
      return;
    }

    if (isPointerEvent(event)) {
      this.updatePreviewPosition(event);
      await this.updateComplete;
    }

    this.dispatchPreviewTimeUpdate.cancel();

    this.context.showing = false;
    this.removeAttribute('previewing');
    this.previewSlotElement?.setAttribute('hidden', '');
    this.dispatchEvent(new ScrubberPreviewHideEvent({ originalEvent: event }));
    this.requestUpdate();
  }

  /**
   * @protected
   * @type {import('../../../utils/timing').RafThrottledFunction<(originalEvent: Event) => void>}
   */
  dispatchPreviewTimeUpdate = rafThrottle((originalEvent) => {
    if (!this.isInteracting) return;

    this.dispatchEvent(
      new ScrubberPreviewTimeUpdateEvent({
        detail: this.context.time,
        originalEvent
      })
    );
  });

  /**
   * @protected
   * @param {number} time
   * @param {Event} event
   */
  updatePreviewTime(time, event) {
    this.context.time = clampNumber(0, round(time, 5), this.mediaDuration);
    this.style.setProperty(
      '--vds-scrubber-preview-time',
      String(this.context.time)
    );
    this.dispatchPreviewTimeUpdate(event);
  }

  /**
   * @protected
   * @param {number} thumbPosition - `pointerEvent.clientX`
   * @returns {number}
   */
  calcPercentageOfTrackAtThumbPosition(thumbPosition) {
    if (isNil(this.trackElement)) return 0;
    const trackRect = this.trackElement.getBoundingClientRect();
    const percentage =
      (100 / trackRect.width) * (thumbPosition - trackRect.left);
    return clampNumber(0, percentage, 100);
  }

  /**
   * @protected
   * @param {number} percentage - the percentage of the track to position the preview at.
   * @returns {number}
   */
  calcPreviewXPosition(percentage) {
    if (isNil(this.previewSlotElement) || isNil(this.trackElement)) return 0;

    const { width: trackWidth } = this.trackElement.getBoundingClientRect();
    const { width: previewWidth } =
      this.previewSlotElement.getBoundingClientRect();

    const left = (percentage / 100) * trackWidth - previewWidth / 2;
    const rightLimit = trackWidth - previewWidth;

    return this.noClamp ? left : clampNumber(0, left, rightLimit);
  }

  /**
   * @protected
   * @type {number}
   */
  previewPositionRafId = 0;

  /**
   * Updates the slotted preview element position given a `PointerEvent`, or `VdsCustomEvent` with
   * an `originalEvent` property referencing a `PointerEvent`.
   *
   * @param {PointerEvent | VdsCustomEvent} event
   * @returns {Promise<void>}
   */
  async updatePreviewPosition(event) {
    window.cancelAnimationFrame(this.previewPositionRafId);

    this.previewPositionRafId = await raf(() => {
      const pointerEvent = isVdsEvent(event) ? event.originalEvent : event;

      if (!isPointerEvent(pointerEvent)) return;

      const percent = this.calcPercentageOfTrackAtThumbPosition(
        pointerEvent.clientX
      );

      const time = (percent / 100) * this.mediaDuration;

      this.updatePreviewTime(time, event);

      if (!isNil(this.previewSlotElement)) {
        const xPos = this.calcPreviewXPosition(percent);
        this.previewSlotElement.style.transform = `translateX(${xPos}px)`;
      }
    });
  }
}

export const SCRUBBER_PREVIEW_ELEMENT_STORYBOOK_ARG_TYPES = {
  noClamp: { control: StorybookControl.Boolean, defaultValue: false },
  noTrackFill: { control: StorybookControl.Boolean, defaultValue: false }
};
