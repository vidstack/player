import { assign, createMachine, interpret } from '@xstate/fsm';

import { createContext } from '../../base/context';

const context = {
  /**
   * Whether the scrubber handle is currently being dragged.
   */
  dragging: false,
  /**
   * Whether a device pointer is within the scrubber bounds.
   */
  pointing: false
};

type Context = typeof context;

type Events =
  | { type: 'start-dragging' }
  | { type: 'stop-dragging' }
  | { type: 'start-pointing' }
  | { type: 'stop-pointing' };

type States = ({ value: 'idle' } | { value: 'interactive' }) & {
  context: Context;
};

const machine = createMachine<Context, Events, States>({
  id: '@vidstack/scrubber',
  initial: 'idle',
  states: {
    idle: {
      on: {
        'start-dragging': {
          target: 'interactive',
          actions: assign<Context>({ dragging: true })
        },
        'start-pointing': {
          target: 'interactive',
          actions: assign<Context>({ pointing: true })
        }
      }
    },
    interactive: {
      entry: assign<Context>({ dragging: true }),
      on: {
        'start-dragging': {
          target: 'interactive',
          actions: assign<Context>({ dragging: true })
        },
        'stop-dragging': {
          target: 'idle',
          cond: ({ pointing }) => !pointing,
          actions: assign<Context>({ dragging: false })
        },
        'stop-pointing': {
          target: 'idle',
          cond: ({ dragging }) => !dragging,
          actions: assign<Context>({ pointing: false })
        }
      }
    }
  }
});

export const scrubberServiceContext = createContext(() => interpret(machine));
