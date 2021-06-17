import { TimeElementProps } from '../time';

export type CurrentTimeDisplay = TimeElementProps;

export type TimeCurrentElementProps = Omit<TimeElementProps, 'seconds'>;
