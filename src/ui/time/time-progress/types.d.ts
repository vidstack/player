import {
  StorybookArgs,
  StorybookArgTypes
} from '../../../foundation/storybook/index.js';
import { TimeElementProps } from '../time/index.js';
import { TimeCurrentElement } from '../time-current/index.js';
import { TimeDurationElement } from '../time-duration/index.js';

export type TimeProgressDisplay = TimeProgressElementProps;

export type TimeProgressElementProps = Omit<
  TimeElementProps,
  'rootElement' | 'seconds' | 'label'
> & {
  /**
   * ♿ **ARIA:** The `aria-label` property for the current time.
   */
  currentTimeLabel: string;

  /**
   * ♿ **ARIA:** The `aria-label` property for the duration.
   */
  durationLabel: string;

  /**
   * A string that is used to separate the current time and duration.
   */
  timeSeparator: string;

  /**
   * The component's root element.
   *
   * @default HTMLDivElement
   */
  readonly rootElement: HTMLDivElement;

  /**
   * The underlying `vds-time-current` component.
   *
   * @default TimeCurrent
   */
  readonly timeCurrentElement: TimeCurrentElement;

  /**
   * The underlying `vds-time-duration` component.
   *
   * @default TimeDuration
   */
  readonly timeDurationElement: TimeDurationElement;

  /**
   * The separator element.
   *
   * @default HTMLSpanElement
   */
  readonly separatorElement: HTMLSpanElement;
};

export interface TimeProgressElementMediaProps {
  mediaCurrentTime: number;
  mediaDuration: number;
}

export type TimeProgressElementStorybookArgTypes = StorybookArgTypes<
  TimeProgressElementProps & TimeProgressElementMediaProps
>;

export type TimeProgressElementStorybookArgs = StorybookArgs<
  TimeProgressElementProps & TimeProgressElementMediaProps
>;
