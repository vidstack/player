import {
	mediaContext,
	MediaRemoteControl,
	VdsMuteRequestEvent,
	VdsUnmuteRequestEvent
} from '../../../media/index.js';
import {
	storybookAction,
	StorybookControlType
} from '../../../shared/storybook/index.js';
import {
	ToggleButtonElement,
	VDS_TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES
} from '../toggle-button/index.js';

export const VDS_MUTE_BUTTON_ELEMENT_TAG_NAME = 'vds-mute-button';

/** @typedef {import('./types').MuteButton} MuteButton */

/**
 * A button for toggling the muted state of the player.
 *
 * @implements {MuteButton}
 *
 * @tagname vds-mute-button
 *
 * @slot mute - The content to show when the `muted` state is `false`.
 * @slot unmute - The content to show when the `muted` state is `true`.
 *
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 *
 * @example
 * ```html
 * <vds-mute-button>
 *   <!-- Showing -->
 *   <div slot="mute"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="unmute" hidden></div>
 * </vds-mute-button>
 * ```
 */
export class MuteButtonElement extends ToggleButtonElement {
	/**
	 * @protected
	 * @readonly
	 */
	remoteControl = new MediaRemoteControl(this);

	constructor() {
		super();

		// Properties
		this.label = 'Mute';
		/** @internal @readonly @type {boolean} */
		this.pressed = mediaContext.muted.initialValue;
	}

	/** @type {import('../../../shared/context').ContextConsumerDeclarations} */
	static get contextConsumers() {
		return {
			pressed: mediaContext.muted
		};
	}

	get muteSlotElement() {
		return this.currentNotPressedSlotElement;
	}

	get unmuteSlotElement() {
		return this.currentPressedSlotElement;
	}

	/** @protected */
	getPressedSlotName() {
		return 'unmute';
	}

	/** @protected */
	getNotPressedSlotName() {
		return 'mute';
	}

	/**
	 * @protected
	 * @param {Event} event
	 * @returns {void}
	 */
	handleButtonClick(event) {
		if (this.pressed) {
			this.remoteControl.unmute(event);
		} else {
			this.remoteControl.mute(event);
		}
	}
}

/**
 * @readonly
 * @type {import('./types').MuteButtonElementStorybookArgTypes}
 */
export const VDS_MUTE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES = {
	...VDS_TOGGLE_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
	label: { control: StorybookControlType.Text, defaultValue: 'Mute' },
	pressed: { control: StorybookControlType.Boolean, table: { disable: true } },
	mediaMuted: {
		control: StorybookControlType.Boolean,
		defaultValue: false
	},
	onVdsMuteRequest: storybookAction(VdsMuteRequestEvent.TYPE),
	onVdsUnmuteRequest: storybookAction(VdsUnmuteRequestEvent.TYPE)
};
