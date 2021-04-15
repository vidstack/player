import { TimeElementProps } from '../time';

export const TIME_DURATION_ELEMENT_TAG_NAME = `time-duration`;

export type TimeDurationElementProps = Omit<TimeElementProps, 'seconds'>;
