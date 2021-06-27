import {
	StorybookArgs,
	StorybookArgTypes
} from '../../../shared/storybook/index.js';
import { ButtonElement } from '../button/index.js';
import { NativeButtonElementStorybookEvents } from '../button/types.js';
import { ToggleElementProps } from '../toggle/index.js';

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

export type ToggleButtonElementStorybookArgTypes = StorybookArgTypes<
	ToggleButtonElementProps,
	NativeButtonElementStorybookEvents
>;

export type ToggleButtonElementStorybookArgs = StorybookArgs<
	ToggleButtonElementProps,
	NativeButtonElementStorybookEvents
>;
