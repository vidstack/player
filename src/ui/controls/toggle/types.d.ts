export type Toggle = ToggleElementProps;

export interface ToggleElementProps {
	/**
	 * Whether the toggle is in the `pressed` state.
	 */
	pressed: boolean;

	/**
	 * The element to display when the toggle is in the `pressed` state.
	 */
	readonly pressedSlotElement: HTMLElement | undefined;

	/**
	 * The element to display when the toggle is in the `not-pressed` state.
	 */
	readonly notPressedSlotElement: HTMLElement | undefined;
}
