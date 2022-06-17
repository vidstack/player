import {
  type DeferredPromise,
  deferredPromise,
  DisposalBin,
  isMouseEvent,
  isPointerEvent,
  isTouchEvent,
  listen,
  storeSubscription,
  vdsEvent,
} from '@vidstack/foundation';
import { css, type CSSResultGroup, LitElement, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import { mediaProviderElementContext, mediaStoreContext } from '../../media';
import { type MediaProviderElement } from '../../media/provider/MediaProviderElement';

// We perform gestures in batches to enable prioritization. Each batch belongs to a root
// media container. This is to ensure gestures on one player don't affect another.
const pendingActions = new Map<
  HTMLElement,
  Map<GestureElement, [event: Event, promise: DeferredPromise]>
>();

export type GestureType = keyof HTMLElementEventMap;

export type GestureAction =
  | 'play'
  | 'pause'
  | 'mute'
  | 'unmute'
  | 'enter-fullscreen'
  | 'exit-fullscreen'
  | `seek:${number}`
  | `toggle:${'paused' | 'muted' | 'fullscreen'}`;

/**
 * This element enables 'actions' to be performed on the media provider based on user gestures.
 *
 * The `GestureElement` can be used to build features such as:
 *
 * - Click the player to toggle playback.
 * - Double-click the player to toggle fullscreen.
 * - Tap the sides of the player to seek forwards or backwards.
 * - Pause media when the user's mouse leaves the player.
 *
 * This is a simple list, but it should give you an idea on when to reach for this element.
 *
 * @experimental
 * @tagname vds-gesture
 * @example
 * ```html
 * <vds-media>
 *   <vds-gesture type="mouseleave" action="pause"></vds-gesture>
 *   <vds-gesture type="click" action="toggle:paused"></vds-gesture>
 *   <vds-gesture
 *     type="click"
 *     repeat="1"
 *     action="toggle:fullscreen"
 *     priority="0"
 *   ></vds-gesture>
 * </vds-media>
 * ```
 */
export class GestureElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: block;
          contain: content;
          z-index: 0;
          opacity: 0;
          visibility: hidden;
          pointer-events: none !important;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  protected _mediaProviderElement?: MediaProviderElement;
  protected _disposal = new DisposalBin();

  /** Pending actions that belong to the same container as this gesture element. */
  protected get _pendingActions() {
    return this._mediaProviderElement ? pendingActions.get(this._mediaProviderElement) : undefined;
  }

  /** Pending action that belongs to this gesture element. */
  protected get _pendingAction() {
    return this._pendingActions?.get(this);
  }

  constructor() {
    super();
    // TODO: fix this type error.
    // @ts-expect-error - ?
    storeSubscription(this, mediaProviderElementContext, (element) => {
      this._mediaProviderElement = element;
    });
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The DOM event type that will trigger this gesture. It can be any valid DOM event type.
   *
   * @example 'pointerdown'
   * @example 'mouseleave'
   * @example 'touchstart'
   */
  @property() type?: GestureType;

  /**
   * The number of times a gesture event `type` should be repeated before the action is
   * performed. Keep in mind that the provided value is a multiplier, and not a constant. Thus, if
   * you want an event to occur twice before the action is performed, this will be a single
   * repetition (eg: value of `1`).
   *
   * @defaultValue 0
   * @example 0 - wait for event to occur once.
   * @example 1 - wait for event to occur twice.
   * @example 2 - wait for event to occur thrice.
   */
  @property({ type: Number }) repeat = 0;

  /**
   * The level of importance given to this gesture. If multiple gestures occur at the same time,
   * the priority will determine which gesture actions are performed. Higher priority gestures in
   * a single batch will cause lower level priorities to be ignored.
   *
   *💡 A lower priority value means greater prioritization (eg: `0 > 1 > 2 > ... > 100`).
   *
   * @defaultValue 10
   */
  @property({ type: Number }) priority = 10;

  /**
   * An action describes the type of media request event that will be dispatched, which will
   * ultimately perform some operation on the player (eg: fullscreen, mute, etc.).
   *
   * @example 'play'
   * @example 'seek:30'
   * @example 'seek:-30'
   * @example 'toggle:paused'
   */
  @property() action?: GestureAction;

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override connectedCallback(): void {
    super.connectedCallback();

    // Wait for media container to be attached to DOM.
    window.requestAnimationFrame(() => {
      if (this._mediaProviderElement) {
        pendingActions.set(this._mediaProviderElement, new Map());
      }
    });
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    this._attachListener();
    this._subscribeToToggleStore();
    this._subscribeToSeekStore();
    super.willUpdate(changedProperties);
  }

  override disconnectedCallback(): void {
    this._disposal.empty();

    this._pendingAction?.[1].resolve();
    this._pendingActions?.delete(this);

    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------------------------

  performAction(event?: Event) {
    if (!this.action) return;

    let detail;
    let eventType: string = this.action;

    if (this.action.startsWith('toggle:')) {
      eventType = this._getToggleEventType();
    }

    if (this.action.startsWith('seek:')) {
      eventType = 'seek';
      detail = this._mediaCurrentTime + Number(this.action.split(':')[1]);
    }

    this.dispatchEvent(
      // @ts-expect-error - global event type.
      vdsEvent(`vds-${eventType}-request`, {
        bubbles: true,
        composed: true,
        detail,
        triggerEvent: event,
      }),
    );
  }

  protected _attachListener() {
    this._disposal.empty();

    if (!this._mediaProviderElement || !this.type || !this.action) return;

    let count = 0;
    let timeoutId;

    const resolve = (skip = false) => {
      count += 1;
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const promise = this._pendingAction?.[1];

        if (skip) {
          // Delete it first so it's not included in batch.
          this._pendingActions?.delete(this);
        }

        processPendingActions(this._mediaProviderElement!);

        count = 0;
        promise?.resolve();
      }, 250);
    };

    const off = listen(this._mediaProviderElement, this.type, (event) => {
      if (!this._validateEvent(event)) return;

      event.preventDefault();

      if (count == 0) {
        this._pendingActions?.set(this, [event, deferredPromise()]);
      }

      resolve(count < this.repeat);
    });

    this._disposal.add(off);
  }

  protected _validateEvent(event: Event) {
    if (isPointerEvent(event) || isMouseEvent(event) || isTouchEvent(event)) {
      const touch = isTouchEvent(event) ? event.touches[0] : undefined;

      const clientX = touch?.clientX ?? (event as MouseEvent).clientX;
      const clientY = touch?.clientY ?? (event as MouseEvent).clientY;
      const rect = this.getBoundingClientRect();

      const isValidRegion =
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        clientX >= rect.left &&
        clientX <= rect.right;

      return event.type.includes('leave') ? !isValidRegion : isValidRegion;
    }

    return true;
  }

  // -------------------------------------------------------------------------------------------
  // Seek
  // -------------------------------------------------------------------------------------------

  protected _mediaCurrentTime = 0;

  protected _subscribeToSeekStore() {
    if (!this.action?.startsWith('seek')) return;

    const unsub = this._mediaStore.currentTime.subscribe(($currentTime) => {
      this._mediaCurrentTime = $currentTime;
    });

    this._disposal.add(unsub);
  }

  // -------------------------------------------------------------------------------------------
  // Toggle
  // -------------------------------------------------------------------------------------------

  protected _currentToggleState = false;

  protected _mediaStoreConsumer = mediaStoreContext.consume(this);
  protected get _mediaStore() {
    return this._mediaStoreConsumer.value;
  }

  protected _getToggleEventType(): string {
    const toggleType = this.action?.split(':')[1];
    switch (toggleType) {
      case 'paused':
        return this._currentToggleState ? 'play' : 'pause';
      case 'muted':
        return this._currentToggleState ? 'unmute' : 'mute';
      case 'fullscreen':
        return `${this._currentToggleState ? 'exit' : 'enter'}-fullscreen`;
      default:
        return '';
    }
  }

  protected _subscribeToToggleStore() {
    if (!this.action?.startsWith('toggle:')) return;

    const action = this.action.split(':')[1];

    const unsub = this._mediaStore[action]?.subscribe(($value) => {
      this._currentToggleState = $value;
    });

    if (unsub) this._disposal.add(unsub);
  }
}

const inProgress = new WeakSet<HTMLElement>();
async function processPendingActions(container: HTMLElement) {
  if (inProgress.has(container)) return;

  const actions = pendingActions.get(container);
  if (!actions) return;

  inProgress.add(container);

  const wait = Array.from(actions.values()).map((action) => action[1].promise);

  await Promise.all(wait);

  const gestures = Array.from(actions.keys());
  const highestPriority = Math.min(...gestures.map((g) => g.priority));

  gestures
    .filter((g) => g.priority <= highestPriority)
    .map((g) => {
      const event = actions.get(g)![0];
      g.performAction(event);
    });

  actions.clear();
  inProgress.delete(container);
}
