import {
	StorybookArgs,
	StorybookArgTypes
} from '../../shared/storybook/index.js';
import { VdsMediaRequestEvents } from '../media-request.events.js';
import { MediaProviderElement } from '../provider/index.js';
import { MediaControllerElement } from './MediaControllerElement.js';

declare module './MediaControllerElement.js' {
	interface MediaControllerElement extends MediaProviderElement {}
}

export type MediaControllerElementStorybookArgTypes = StorybookArgTypes<
	{},
	VdsMediaRequestEvents
>;

export type MediaControllerElementStorybookArgs = StorybookArgs<
	{},
	VdsMediaRequestEvents
>;
