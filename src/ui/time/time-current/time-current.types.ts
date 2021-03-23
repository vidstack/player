import { TimeProps } from '../time';

export type TimeCurrentProps = Omit<TimeProps, 'seconds'>;

export interface TimeCurrentFakeProps {
  fakeCurrentTime: number;
}
