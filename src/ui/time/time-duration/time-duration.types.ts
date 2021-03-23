import { TimeProps } from '../time';

export type TimeDurationProps = Omit<TimeProps, 'seconds'>;

export interface TimeDurationFakeProps {
  fakeDuration: number;
}
