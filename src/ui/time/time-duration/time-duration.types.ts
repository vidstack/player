import { TimeProps } from '../time';

export type TimeDurationProps = Omit<TimeProps, 'duration'>;

export interface TimeDurationFakeProps {
  fakeDuration: number;
}
