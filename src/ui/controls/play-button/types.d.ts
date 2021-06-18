import { ToggleButtonElementProps } from '../toggle-button';

export type PlayButton = ToggleButtonElementProps;

export type PlayButtonElementProps = ToggleButtonElementProps & {
	/**
	 * The `play` slotted element.
	 */
	readonly playSlotElement: HTMLElement | undefined;

	/**
	 * The `pause` slotted element.
	 */
	readonly pauseSlotElement: HTMLElement | undefined;
};
