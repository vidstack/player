import { ToggleButtonElementProps } from '../toggle-button';

export type MuteButton = MuteButtonElementProps;

export type MuteButtonElementProps = ToggleButtonElementProps & {
	/**
	 * The slotted element to display when the muted state is `false`.
	 */
	readonly muteSlotElement: HTMLElement | undefined;

	/**
	 * The slotted element to display when the muted state is `true`.
	 */
	readonly unmuteSlotElement: HTMLElement | undefined;
};
