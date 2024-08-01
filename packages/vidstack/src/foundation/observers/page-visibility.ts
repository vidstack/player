import { signal } from 'maverick.js';
import { EventsController, listenEvent } from 'maverick.js/std';

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

export class PageVisibility {
  #state = signal<PageState>(determinePageState());

  #visibility = signal<DocumentVisibility>(__SERVER__ ? 'visible' : document.visibilityState);

  #safariBeforeUnloadTimeout: any;

  connect() {
    const events = new EventsController(window),
      handlePageEvent = this.#handlePageEvent.bind(this);

    for (const eventType of PAGE_EVENTS) {
      events.add(eventType, handlePageEvent);
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
      events.add('beforeunload', (event) => {
        this.#safariBeforeUnloadTimeout = setTimeout(() => {
          if (!(event.defaultPrevented || (event.returnValue as any).length > 0)) {
            this.#state.set('hidden');
            this.#visibility.set('hidden');
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
  get pageState(): PageState {
    return this.#state();
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
  get visibility(): DocumentVisibility {
    return this.#visibility();
  }

  #handlePageEvent(event: Event) {
    if (IS_SAFARI) window.clearTimeout(this.#safariBeforeUnloadTimeout);
    // The `blur` event can fire while the page is being unloaded, so we only need to update the
    // state if the current state is "active".
    if (event.type !== 'blur' || this.#state() === 'active') {
      this.#state.set(determinePageState(event));
      // The ternary condition is incase some browser implements other states such as `prerender`.
      this.#visibility.set(document.visibilityState == 'hidden' ? 'hidden' : 'visible');
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
