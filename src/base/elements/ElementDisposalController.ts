import { ReactiveElement } from 'lit';

import { DisposalBin } from '../events/index';

/**
 * Sets up a disposal bin that is emptied once the given `host` element disconnects from the DOM.
 */
export class ElementDisposalController {
  protected readonly _disposal = new DisposalBin();

  constructor(host: ReactiveElement) {
    host.addController({
      hostDisconnected: () => {
        this._disposal.empty();
      }
    });
  }

  /**
   * Add callback to be called when `host` element disconnects from DOM.
   *
   * @param callback
   */
  add(callback?: () => void) {
    this._disposal.add(callback);
  }

  /**
   * Pre-dispose of callbacks.
   */
  empty() {
    this._disposal.empty();
  }
}
