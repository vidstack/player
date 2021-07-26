import { DisposalBin } from '../events/index.js';

/**
 * Sets up a disposal bin that is emptied once the given `host` element disconnects from the DOM.
 */
export class ElementDisposalController {
  /**
   * @protected
   * @readonly
   */
  _disposal = new DisposalBin();

  /**
   * @param {import('lit').ReactiveElement} host
   */
  constructor(host) {
    host.addController({
      hostDisconnected: () => {
        this._disposal.empty();
      }
    });
  }

  /**
   * Add callback to be called when `host` element disconnects from DOM.
   *
   * @param {() => void} [callback]
   */
  add(callback) {
    this._disposal.add(callback);
  }

  /**
   * Pre-dispose of callbacks.
   */
  empty() {
    this._disposal.empty();
  }
}
