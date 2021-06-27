import {
  StorybookArgs,
  StorybookArgTypes
} from '../../../shared/storybook/index.js';
import { TimeElementProps } from '../time/index.js';

export type DurationDisplay = TimeDurationElementProps;

export type TimeDurationElementProps = Omit<TimeElementProps, 'seconds'>;

export interface TimeDurationElementMediaProps {
  mediaDuration: number;
}

export type TimeDurationElementStorybookArgTypes = StorybookArgTypes<
  TimeDurationElementProps & TimeDurationElementMediaProps
>;

export type TimeDurationElementStorybookArgs = StorybookArgs<
  TimeDurationElementProps & TimeDurationElementMediaProps
>;
