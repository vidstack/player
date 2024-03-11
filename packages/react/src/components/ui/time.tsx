import * as React from 'react';

import {
  composeRefs,
  createReactComponent,
  useSignal,
  type ReactElementProps,
} from 'maverick.js/react';

import { TimeInstance } from '../primitives/instances';
import { Primitive } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Time
 * -----------------------------------------------------------------------------------------------*/

const TimeBridge = createReactComponent(TimeInstance);

export interface TimeProps extends ReactElementProps<TimeInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

/**
 * Outputs a media duration (eg: `currentTime`, `duration`, `bufferedAmount`, etc.) value as time
 * formatted text.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/time}
 * @example
 * ```tsx
 * <Time type="current" />
 * ```
 */
const Time = React.forwardRef<HTMLElement, TimeProps>(({ children, ...props }, forwardRef) => {
  return (
    <TimeBridge {...(props as Omit<TimeProps, 'ref'>)}>
      {(props, instance) => (
        <TimeText
          {...props}
          instance={instance}
          ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
        >
          {children}
        </TimeText>
      )}
    </TimeBridge>
  );
});

Time.displayName = 'Time';
export { Time };

/* -------------------------------------------------------------------------------------------------
 * TimeText
 * -----------------------------------------------------------------------------------------------*/

interface TimeTextProps extends Record<string, any> {
  instance: TimeInstance;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

const TimeText = React.forwardRef<HTMLElement, TimeTextProps>(
  ({ instance, children, ...props }, forwardRef) => {
    const { timeText } = instance.$state,
      $timeText = useSignal(timeText);
    return (
      <Primitive.div {...props} ref={forwardRef as React.Ref<any>}>
        {$timeText}
        {children}
      </Primitive.div>
    );
  },
);

TimeText.displayName = 'TimeText';
