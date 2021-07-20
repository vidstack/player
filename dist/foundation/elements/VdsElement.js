import { LitElement } from 'lit';
import { WithContext } from '../context/index.js';
import { DisposalBin } from '../events/index.js';
export class VdsElement extends WithContext(LitElement) {
  constructor() {
    super(...arguments);
    /**
     * @protected
     * @readonly
     */
    this.disconnectDisposal = new DisposalBin();
  }
  /** @type {string[]} */
  static get parts() {
    return [];
  }
  /** @type {string[]} */
  static get events() {
    return [];
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.disconnectDisposal.empty();
  }
}
