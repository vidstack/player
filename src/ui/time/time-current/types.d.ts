import { TimeElementProps } from '../time.js';

export type CurrentTimeDisplay = TimeElementProps;

export type TimeCurrentElementProps = Omit<TimeElementProps, 'seconds'>;
