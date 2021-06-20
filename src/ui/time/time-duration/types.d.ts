import { TimeElementProps } from '../time.js';

export type DurationDisplay = TimeDurationElementProps;

export type TimeDurationElementProps = Omit<TimeElementProps, 'seconds'>;
