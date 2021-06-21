import {
	StorybookArgs,
	StorybookArgTypes
} from '../../../shared/storybook/index.js';
import { TimeElementProps } from '../time/index.js';

export type CurrentTimeDisplay = TimeElementProps;

export type TimeCurrentElementProps = Omit<TimeElementProps, 'seconds'>;

export interface TimeCurrentElementMediaProps {
	mediaCurrentTime: number;
}

export type TimeCurrentElementStorybookArgTypes = StorybookArgTypes<
	TimeCurrentElementProps & TimeCurrentElementMediaProps
>;

export type TimeCurrentElementStorybookArgs = StorybookArgs<
	TimeCurrentElementProps & TimeCurrentElementMediaProps
>;
