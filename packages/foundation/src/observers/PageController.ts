import { type ReactiveController, type ReactiveControllerHost } from 'lit';

import { LogDispatcher } from '../logger/LogDispatcher';
import { DisposalBin, listen } from '../utils/events';

// Detect Safari to work around Safari-specific bugs.
const IS_SAFARI =
  typeof window !== 'undefined' &&
  typeof window.safari === 'object' &&
  // @ts-expect-error - `pushNotification` type missing.
  window?.safari.pushNotification;

/**
 * The current page state. Important to note we only account for a subset of page states, as
 * the rest aren't valuable to the player at the moment.
 *
 * - **active:** A page is in the active state if it is visible and has input focus.
 * - **passive:** A page is in the passive state if it is visible and does not have input focus.
 * - **hidden:** A page is in the hidden state if it is not visible.
 *
 * @see https://developers.google.com/web/updates/2018/07/page-lifecycle-api#states
 */
export type PageState = 'active' | 'passive' | 'hidden';

/**
 * The current page visibility state.
 *
 * - **visible:** The page content may be at least partially visible. In practice, this means that
 * the page is the foreground tab of a non-minimized window.
 * - **hidden:** The page content is not visible to the user. In practice this means that the
 * document is either a background tab or part of a minimized window, or the OS screen lock is
 * active.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
 */
export type PageVisibility = 'visible' | 'hidden';

/**
 * The callback function for a `PageController`. This is called when either the page
 * state or visibility changes.
 *
 * @see {@link PageState}
 * @see {@link PageVisibility}
 */
export type PageControllerCallback = ({
  state: PageState,
  visibility: PageVisibilityState,
}) => void;

/**
 * `PageController` detects page state or visibility changes for the life of the given `host`
 * element.
 *
 * @see {@link PageState}
 * @see {@link PageVisibility}
 * @see https://developers.google.com/web/updates/2018/07/page-lifecycle-api
 */
export class PageController implements ReactiveController {
  protected _state: PageState = this._determinePageState();
  protected _visibility: PageVisibility = document.visibilityState;
  protected _disposal = new DisposalBin();
  protected _safariBeforeUnloadTimeout?: any;

  get state(): PageState {
    return this._state;
  }

  get visibility(): PageVisibility {
    return this._visibility;
  }

  constructor(
    protected readonly _host: ReactiveControllerHost & EventTarget,
    protected readonly _callback: PageControllerCallback,
    protected readonly _logger = __DEV__ ? new LogDispatcher(_host) : undefined,
  ) {
    _host.addController(this);
  }

  hostConnected() {
    const pageEvents = ['focus', 'blur', 'visibilitychange', 'pageshow', 'pagehide'] as const;

    this._state = this._determinePageState();
    this._visibility = document.visibilityState;

    pageEvents.forEach((pageEvent) => {
      // @ts-expect-error - window event (not global).
      const off = listen(window, pageEvent, this._handlePageEvent.bind(this));
      this._disposal.add(off);
    });

    /**
     * Safari does not reliably fire the `pagehide` or `visibilitychange` events when closing a
     * tab, so we have to use `beforeunload` with a timeout to check whether the default action
     * was prevented.
     *
     * We only add this to Safari because adding it to Firefox would prevent the page from being
     * eligible for `bfcache`.
     *
     * @see https://bugs.webkit.org/show_bug.cgi?id=151610
     * @see https://bugs.webkit.org/show_bug.cgi?id=151234
     */
    if (IS_SAFARI) {
      this._disposal.add(
        // @ts-expect-error - window event (not global).
        listen(window, 'beforeunload', (event) => {
          this._safariBeforeUnloadTimeout = setTimeout(() => {
            if (!(event.defaultPrevented || event.returnValue.length > 0)) {
              this._state = 'hidden';
              this._visibility = 'hidden';
              this._triggerCallback();
            }
          }, 0);
        }),
      );
    }
  }

  hostDisconnected() {
    this._disposal.empty();
  }

  protected _handlePageEvent(event: Event) {
    if (IS_SAFARI) {
      window.clearTimeout(this._safariBeforeUnloadTimeout);
    }

    const prevState = this._state;
    const prevVisibility = this._visibility;

    // The `blur` event can fire while the page is being unloaded, so we
    // only need to update the state if the current state is "active".
    if (event.type !== 'blur' || this.state === 'active') {
      this._state = this._determinePageState(event);
      // The ternary condition is incase some browser implements other states such as `prerender`.
      this._visibility = document.visibilityState == 'hidden' ? 'hidden' : 'visible';
    }

    if (this.state !== prevState || this.visibility !== prevVisibility) {
      this._triggerCallback();
    }
  }

  protected _triggerCallback() {
    this._callback({ state: this.state, visibility: this.visibility });
  }

  protected _determinePageState(event?: Event): PageState {
    if (__NODE__) return 'hidden';

    if (event?.type === 'blur' || document.visibilityState === 'hidden') {
      return 'hidden';
    }

    if (document.hasFocus()) {
      return 'active';
    }

    return 'passive';
  }
}
