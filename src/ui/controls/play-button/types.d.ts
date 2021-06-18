import { ToggleButtonElementProps } from '../toggle-button';

export type PlayButton = ToggleButtonElementProps;

export type PlayButtonElementProps = ToggleButtonElementProps & {
	/**
	 * The slotted element to display when the pause state is `true`.
	 */
	readonly playSlotElement: HTMLElement | undefined;

	/**
	 * The slotted element to display when the pause state is `false`.
	 */
	readonly pauseSlotElement: HTMLElement | undefined;
};
