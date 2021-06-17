import { TimeElementProps } from '../time';

export type DurationDisplay = TimeDurationElementProps;

export type TimeDurationElementProps = Omit<TimeElementProps, 'seconds'>;
