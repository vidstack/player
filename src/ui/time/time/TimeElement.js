import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import { VdsElement } from '../../../shared/elements/index.js';
import { formatHtml5Duration, formatTime } from '../../../utils/time.js';
import { timeElementStyles } from './css.js';

export const VDS_TIME_ELEMENT_TAG_NAME = 'vds-time';

/** @typedef {import('./types').TimeDisplay} TimeDisplay */

/**
 * Formats and displays a length of time given in `seconds`.
 *
 * @implements {TimeDisplay}
 *
 * @tagname vds-time
 *
 * @csspart root - The component's root element (`<time>`).
 *
 * @example
 * ```html
 * <vds-time seconds="50"></vds-time>
 * ```
 *
 * @example
 * ```html
 * <vds-time
 *   label="Current time"
 *   seconds="3650"
 *   pad-hours
 *   always-show-hours
 * ></vds-time>
 * ```
 *
 * @example
 * ```css
 * vds-time::part(root) {
 *   font-size: 16px;
 * }
 * ```
 */
export class TimeElement extends VdsElement {
	/** @type {import('lit').CSSResultGroup} */
	static get styles() {
		return [timeElementStyles];
	}

	/** @type {string[]} */
	static get parts() {
		return ['root', 'time'];
	}

	constructor() {
		super();

		/** @type {string | undefined} */
		this.label = undefined;
		/** @type {number} */
		this.seconds = 0;
		/** @type {boolean} */
		this.alwaysShowHours = false;
		/** @type {boolean} */
		this.padHours = false;
	}

	// -------------------------------------------------------------------------------------------
	// Properties
	// -------------------------------------------------------------------------------------------

	/** @type {import('lit').PropertyDeclarations} */
	static get properties() {
		return {
			label: {},
			seconds: { type: Number },
			alwaysShowHours: { type: Boolean },
			padHours: { type: Boolean }
		};
	}

	// -------------------------------------------------------------------------------------------
	// Render
	// -------------------------------------------------------------------------------------------

	/**
	 * @protected
	 * @readonly
	 * @type {import('lit/directives/ref').Ref<HTMLTimeElement>}
	 */
	rootRef = createRef();

	get rootElement() {
		return /** @type {HTMLTimeElement} */ (this.rootRef.value);
	}

	render() {
		return html`
			<time
				id="root"
				class=${this.getRootClassAttr()}
				part=${this.getRootPartAttr()}
				aria-label=${ifNonEmpty(this.label)}
				datetime=${this.getFormattedDuration()}
				${ref(this.rootRef)}
			>
				${this.renderRootChildren()}
			</time>
		`;
	}

	/**
	 * @protected
	 * @returns {import('lit').TemplateResult}
	 */
	renderRootChildren() {
		return html`${this.getFormattedTime()}`;
	}

	/**
	 * @protected
	 * @returns {string} The seconds formatted into human readable form.
	 */
	getFormattedTime() {
		return formatTime(this.seconds, this.padHours, this.alwaysShowHours);
	}

	/**
	 * @protected
	 * @returns {string} A valid HTML5 duration.
	 *
	 * @spec https://www.w3.org/TR/2014/REC-html5-20141028/infrastructure.html#valid-duration-string
	 */
	getFormattedDuration() {
		return formatHtml5Duration(this.seconds);
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
		return 'root time';
	}
}
