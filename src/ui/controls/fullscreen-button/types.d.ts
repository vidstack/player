import { ToggleButtonElementProps } from '../toggle-button';

export type FullscreenButton = FullscreenButtonElementProps & {
	/**
	 * The `enter` slotted element.
	 */
	readonly enterSlotElement: HTMLElement | undefined;

	/**
	 * The `exit` slotted element.
	 */
	readonly exitSlotElement: HTMLElement | undefined;
};

export type FullscreenButtonElementProps = ToggleButtonElementProps;
