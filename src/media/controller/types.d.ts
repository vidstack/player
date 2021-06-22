import {
	StorybookArgs,
	StorybookArgTypes
} from '../../shared/storybook/index.js';
import { VdsMediaRequestEvents } from '../media-request.events.js';

export type MediaControllerElementStorybookArgTypes = StorybookArgTypes<
	{},
	VdsMediaRequestEvents
>;

export type MediaControllerElementStorybookArgs = StorybookArgs<
	{},
	VdsMediaRequestEvents
>;
