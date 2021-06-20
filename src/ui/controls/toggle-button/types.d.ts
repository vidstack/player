import { ButtonElement } from '../button.js';
import { ToggleElementProps } from '../toggle.js';

export type ToggleButton = ToggleButtonElementProps;

export interface ToggleButtonElementProps extends ToggleElementProps {
	/**
	 * Whether the underlying button should be disabled (not-interactable).
	 */
	disabled: boolean;

	/**
	 * ♿ **ARIA:** Identifies the element (or elements) that describes the underlying button.
	 */
	describedBy?: string;

	/**
	 * ♿ **ARIA:** The `aria-label` property of the underlying button.
	 *
	 * @required
	 */
	label?: string;

	/**
	 * The component's root element.
	 */
	readonly rootElement: ButtonElement;
}
