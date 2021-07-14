import { DisposalBin } from '../events/index.js';

/**
 * Sets up a disposal bin that is emptied once the given `host` element disconnects from the DOM.
 */
export class ElementDisposalController {
  /**
   * @protected
   * @readonly
   */
  disconnectDisposal = new DisposalBin();

  /**
   * @param {import('lit').ReactiveElement} host
   */
  constructor(host) {
    host.addController({
      hostDisconnected: () => {
        this.disconnectDisposal.empty();
      }
    });
  }

  /**
   * Add callback to be called when `host` element disconnects from DOM.
   *
   * @param {import('../types').Callback<void>} [callback]
   */
  add(callback) {
    this.disconnectDisposal.add(callback);
  }
}
