import { mediaContext, MediaRemoteControl } from '../../../media';
import { ToggleButtonElement } from '../toggle-button';

export const VDS_PLAY_BUTTON_ELEMENT_TAG_NAME = 'vds-play-button';

/** @typedef {import('./types').PlayButton} PlayButton */

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * @implements {PlayButton}
 *
 * @tagname vds-play-button
 *
 * @slot play - The content to show when the `paused` state is `true`.
 * @slot pause - The content to show when the `paused` state is `false`.
 *
 * @csspart button - The root button (`<vds-button>`).
 * @csspart button-* - All `vds-button` parts re-exported with the `button` prefix such as `button-root`.
 *
 * @example
 * ```html
 * <vds-play-button>
 *   <!-- Showing -->
 *   <div slot="play"></div>
 *   <!-- Hidden - `hidden` attribute will automatically be applied/removed -->
 *   <div slot="pause" hidden></div>
 * </vds-play-button>
 * ```
 */
export class PlayButtonElement extends ToggleButtonElement {
	/**
	 * @protected
	 * @readonly
	 */
	remoteControl = new MediaRemoteControl(this);

	constructor() {
		super();

		// Properties
		this.label = 'Play';
		/** @internal @readonly @type {boolean} */
		this.pressed = false;
	}

	/** @type {import('../../../shared/context').ContextConsumerDeclarations} */
	static get contextConsumers() {
		return {
			pressed: {
				context: mediaContext.paused,
				// Transforming `paused` to `!paused` to indicate whether playback has initiated/resumed. Can't
				// use `playing` because there could be a buffering delay (we want immediate feedback).
				transform: (p) => !p
			}
		};
	}

	get playSlotElement() {
		return this.currentNotPressedSlotElement;
	}

	get pauseSlotElement() {
		return this.currentPressedSlotElement;
	}

	/** @protected */
	getPressedSlotName() {
		return 'pause';
	}

	/** @protected */
	getNotPressedSlotName() {
		return 'play';
	}

	/**
	 * @protected
	 * @param {Event} originalEvent
	 * @returns {void}
	 */
	handleButtonClick(originalEvent) {
		if (this.pressed) {
			this.remoteControl.pause(originalEvent);
		} else {
			this.remoteControl.play(originalEvent);
		}
	}
}
