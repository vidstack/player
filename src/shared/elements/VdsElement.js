import { LitElement } from 'lit';

import { WithContext } from '../context';
import { DisposalBin } from '../events';

export class VdsElement extends WithContext(LitElement) {
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
