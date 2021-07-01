import { LitElement } from 'lit';

import { WithContext } from '../context/index.js';
import { DisposalBin } from '../events/index.js';

export class VdsElement extends WithContext(LitElement) {
  /** @type {string[]} */
  static get parts() {
    return [];
  }

  /** @type {string[]} */
  static get events() {
    return [];
  }

  /**
   * @protected
   * @readonly
   */
  disconnectDisposal = new DisposalBin();

  disconnectedCallback() {
    super.disconnectedCallback();
    this.disconnectDisposal.empty();
  }
}
