import { TimeElementProps } from '../time';

export const TIME_CURRENT_ELEMENT_TAG_NAME = `time-current`;

export type TimeCurrentElementProps = Omit<TimeElementProps, 'seconds'>;
