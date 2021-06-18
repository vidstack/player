// ** Dependencies **
import '../button/define';

import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { WithFocus } from '../../../shared/elements/WithFocus';
import { buildExportPartsAttr } from '../../../utils/dom';
import { ButtonElement } from '../button';
import { ToggleElement } from '../toggle';

export const VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME = 'vds-toggle-button';

/** @typedef {import('./types').ToggleButton} ToggleButton */

/**
 * The foundation for any toggle button such as a `play-button` or `mute-button`.
 *
 * @implements {ToggleButton}
 *
 * @tagname vds-toggle-button
 *
 * @csspart button - The root button component (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 *
 * @slot The content to show when the toggle is not pressed.
 * @slot pressed - The content to show when the toggle is pressed.
 *
 * @example
 * ```html
 * <vds-toggle-button label="Some action">
 *   <!-- Showing -->
 *   <div slot="pressed"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div hidden></div>
 * </vds-toggle-button>
 * ```
 */
export class ToggleButtonElement extends WithFocus(ToggleElement) {
	/** @type {string[]} */
	static get parts() {
		return [
			'root',
			'button',
			...ButtonElement.parts.map((part) => `button-${part}`)
		];
	}

	constructor() {
		super();

		// Properties
		/** @type {string | undefined} */
		this.label = undefined;
		/** @type {boolean} */
		this.disabled = false;
		/** @type {string | undefined} */
		this.describedBy = undefined;
	}

	// -------------------------------------------------------------------------------------------
	// Properties
	// -------------------------------------------------------------------------------------------

	/** @type {import('lit').PropertyDeclarations} */
	static get properties() {
		return {
			label: {},
			disabled: { type: Boolean, reflect: true },
			describedBy: { reflect: true, attribute: 'described-by' }
		};
	}

	// -------------------------------------------------------------------------------------------
	// Render
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @type {import('lit/directives/ref').Ref<ButtonElement>}
	 */
	rootRef = createRef();

	get rootElement() {
		return /** @type {ButtonElement} */ (this.rootRef.value);
	}

	render() {
		return html`
			<vds-button
				id="root"
				class=${this.getRootClassAttr()}
				part=${this.getRootPartAttr()}
				label=${ifNonEmpty(this.label)}
				?pressed=${this.pressed}
				?disabled=${this.disabled}
				described-by=${ifNonEmpty(this.describedBy)}
				@click=${this.handleButtonClick}
				exportparts=${this.getRootExportPartsAttr()}
				${ref(this.rootRef)}
			>
				${this.renderToggle()}
			</vds-button>
		`;
	}

	click() {
		if (this.disabled) return;
		this.rootElement.click();
	}

	/**
	 * Override this to modify root CSS Classes.
	 *
	 * @protected
	 * @returns {string}
	 */
	getRootClassAttr() {
		return 'root';
	}

	/**
	 * Override this to modify root CSS parts.
	 *
	 * @protected
	 * @returns {string}
	 */
	getRootPartAttr() {
		return 'root button';
	}

	/**
	 * Override this to modify root CSS export parts.
	 *
	 * @protected
	 * @returns {string}
	 */
	getRootExportPartsAttr() {
		return buildExportPartsAttr(ButtonElement.parts, 'button');
	}

	/**
	 * Override this to modify on button click behaviour.
	 *
	 * @protected
	 * @param {Event} event
	 * @returns {void}
	 */
	handleButtonClick(event) {
		this.pressed = !this.pressed;
	}
}
