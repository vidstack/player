import { VdsMediaRequestEvents } from '../../../media/index.js';
import {
	StorybookArgs,
	StorybookArgTypes
} from '../../../shared/storybook/index.js';
import { ToggleButtonElementProps } from '../toggle-button/index.js';

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

export interface FakeFullscreenButtonElementProps {
	fakeFullscreen: boolean;
}

export type FullscreenButtonElementStorybookArgTypes = StorybookArgTypes<
	FullscreenButtonElementProps & FakeFullscreenButtonElementProps,
	Pick<
		VdsMediaRequestEvents,
		'vds-enter-fullscreen-request' | 'vds-exit-fullscreen-request'
	>
>;

export type FullscreenButtonElementStorybookArgs = StorybookArgs<
	FullscreenButtonElementProps & FakeFullscreenButtonElementProps,
	Pick<
		VdsMediaRequestEvents,
		'vds-enter-fullscreen-request' | 'vds-exit-fullscreen-request'
	>
>;
