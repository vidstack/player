import { assign, createMachine, interpret } from '@xstate/fsm';

import { createContext } from '../../base/context';

const context = {
  /**
   * The current time of media playback to show a preview for. This is determined by where
   * the device is pointing/dragging at on the scrubber.
   */
  time: 0,
  /**
   * Whether the preview is showing.
   */
  showing: false
};

type Context = typeof context;

type Events =
  | { type: 'show' }
  | { type: 'hide' }
  | { type: 'time-update'; time: number };

type States = ({ value: 'showing' } | { value: 'hidden' }) & {
  context: Context;
};

const machine = createMachine<Context, Events, States>({
  id: '@vidstack/scrubber-preview',
  initial: 'hidden',
  states: {
    showing: {
      on: {
        hide: {
          target: 'hiddden',
          actions: assign((_) => ({ showing: false }))
        },
        'time-update': {
          target: 'showing',
          actions: assign((_, { time }) => ({ time }))
        }
      }
    },
    hidden: {
      on: {
        show: {
          target: 'showing',
          actions: assign((_) => ({ showing: true }))
        }
      }
    }
  }
});

export const scrubberPreviewContext = createContext(() => interpret(machine));
