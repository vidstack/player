import { signal, ViewController } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import { IS_SAFARI } from '../../utils/support';

const PAGE_EVENTS = ['focus', 'blur', 'visibilitychange', 'pageshow', 'pagehide'] as const;

declare global {
  interface GlobalEventHandlersEventMap {
    beforeunload: Event;
    pageshow: Event;
    pagehide: Event;
    visibilitychange: Event;
  }
}

export class PageVisibilityController extends ViewController {
  private _state = signal<PageState>(determinePageState());

  private _visibility = signal<DocumentVisibility>(
    __SERVER__ ? 'visible' : document.visibilityState,
  );

  private _safariBeforeUnloadTimeout: any;

  protected override onConnect() {
    for (const eventType of PAGE_EVENTS) {
      listenEvent(window, eventType, this._handlePageEvent.bind(this));
    }

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
      listenEvent(window, 'beforeunload', (event) => {
        this._safariBeforeUnloadTimeout = setTimeout(() => {
          if (!(event.defaultPrevented || (event.returnValue as any).length > 0)) {
            this._state.set('hidden');
            this._visibility.set('hidden');
          }
        }, 0);
      });
    }
  }

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
  $pageState(): PageState {
    return this._state();
  }

  /**
   * The current document visibility state.
   *
   * - **visible:** The page content may be at least partially visible. In practice, this means that
   * the page is the foreground tab of a non-minimized window.
   * - **hidden:** The page content is not visible to the user. In practice this means that the
   * document is either a background tab or part of a minimized window, or the OS screen lock is
   * active.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
   */
  $visibility(): DocumentVisibility {
    return this._visibility();
  }

  private _handlePageEvent(event: Event) {
    if (IS_SAFARI) window.clearTimeout(this._safariBeforeUnloadTimeout);
    // The `blur` event can fire while the page is being unloaded, so we only need to update the
    // state if the current state is "active".
    if (event.type !== 'blur' || this._state() === 'active') {
      this._state.set(determinePageState(event));
      // The ternary condition is incase some browser implements other states such as `prerender`.
      this._visibility.set(document.visibilityState == 'hidden' ? 'hidden' : 'visible');
    }
  }
}

function determinePageState(event?: Event): PageState {
  if (__SERVER__) return 'hidden';
  if (event?.type === 'blur' || document.visibilityState === 'hidden') return 'hidden';
  if (document.hasFocus()) return 'active';
  return 'passive';
}

export type PageState = 'active' | 'passive' | 'hidden';

export type DocumentVisibility = 'visible' | 'hidden';
