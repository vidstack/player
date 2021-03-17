import { TimeProps } from '../time';

export type TimeCurrentProps = Omit<TimeProps, 'duration'>;

export interface TimeCurrentFakeProps {
  fakeCurrentTime: number;
}
