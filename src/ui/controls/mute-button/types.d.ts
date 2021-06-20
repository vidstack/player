import { ToggleButtonElementProps } from '../toggle-button.js';

export type MuteButton = MuteButtonElementProps;

export type MuteButtonElementProps = ToggleButtonElementProps & {
	/**
	 * The `mute` slotted element.
	 */
	readonly muteSlotElement: HTMLElement | undefined;

	/**
	 * The `unmute` slotted element.
	 */
	readonly unmuteSlotElement: HTMLElement | undefined;
};
