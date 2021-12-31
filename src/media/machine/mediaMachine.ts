import { assign, createMachine, interpret, StateMachine } from '@xstate/fsm';
import { ReactiveControllerHost } from 'lit';

import { createContext } from '../../base/context';
import { hostedServiceSubscription } from '../../base/machine';
import { isArray } from '../../utils/unit';
import { SeekedEvent } from '../events';
import {
  MediaMachineContext,
  mediaMachineContext
} from './MediaMachineContext';
import {
  MediaMachineEventPayload,
  MediaMachineEvents,
  MediaMachineEventType
} from './MediaMachineEvent';
import { MediaMachineState, MediaMachineStates } from './MediaMachineState';

const mediaMachine = createMachine<
  MediaMachineContext,
  MediaMachineEvents,
  MediaMachineStates
>({
  id: '@vidstack/media',
  initial: 'idle',
  context: mediaMachineContext,
  states: {
    idle: {
      on: transitions(loadingTransition(), propertyChangeTransitions('idle'))
    },
    loading: {
      on: transitions(
        loadedTransition(),
        abortedTransition(),
        progressTransition('loading'),
        propertyChangeTransitions('loading')
      )
    },
    loaded: {
      on: transitions(
        canPlayTransition(),
        progressTransition('loaded'),
        propertyChangeTransitions('loaded')
      )
    },
    paused: {
      on: transitions(
        playTransition(),
        seekingTransition(),
        autoplayTransition(),
        canPlayThroughTransition(),
        endedTransition(), // native media is paused before firing ended.
        propertyChangeTransitions('paused'),
        mediaReadyTransitions('paused')
      )
    },
    autoplay: {
      on: transitions(
        playingTransition(),
        autoplayFailTransition(),
        propertyChangeTransitions('autoplay'),
        mediaReadyTransitions('autoplay')
      )
    },
    'autoplay-fail': {
      on: transitions(
        playTransition(),
        seekingTransition(),
        propertyChangeTransitions('autoplay-fail'),
        mediaReadyTransitions('autoplay-fail')
      )
    },
    play: {
      on: transitions(
        waitingTransition(),
        playingTransition(),
        playFailedTransition(),
        propertyChangeTransitions('play'),
        mediaReadyTransitions('play')
      )
    },
    playing: {
      on: transitions(
        pauseTransition(),
        seekingTransition(),
        timeUpdateTransition(),
        waitingTransition(),
        endedTransition(),
        propertyChangeTransitions('playing'),
        mediaReadyTransitions('playing')
      )
    },
    seeking: {
      on: transitions(
        pauseTransition(),
        playingTransition(),
        waitingTransition(),
        propertyChangeTransitions('seeking'),
        mediaReadyTransitions('seeking')
      )
    },
    waiting: {
      on: transitions(
        pauseTransition(),
        playingTransition(),
        seekingTransition(),
        propertyChangeTransitions('waiting'),
        mediaReadyTransitions('waiting')
      )
    },
    ended: {
      on: transitions(
        playTransition(),
        seekingTransition(),
        propertyChangeTransitions('ended'),
        mediaReadyTransitions('ended')
      )
    },
    aborted: {
      on: transitions(srcChangeTransition())
    }
  }
});

type MediaAction<Event extends MediaMachineEventType> = StateMachine.Action<
  MediaMachineContext,
  { type: Event; trigger: MediaMachineEventPayload[Event] }
>;

type MediaTransition<Event extends MediaMachineEventType> =
  StateMachine.Transition<
    MediaMachineContext,
    { type: Event; trigger: MediaMachineEventPayload[Event] }
  >;

type MediaTransitionTuple<Event extends MediaMachineEventType> = [
  Event,
  MediaTransition<Event>
];

type MediaTransitions = {
  [Event in MediaMachineEventType]?: MediaTransition<Event>;
};

function mediaTransition<Event extends MediaMachineEventType>(
  event: Event,
  target: MediaMachineState,
  actions?: MediaAction<Event>[]
): MediaTransitionTuple<Event> {
  return [event, { target, actions }];
}

function transitions(
  ...transitions: (MediaTransitionTuple<any> | MediaTransitionTuple<any>[])[]
): MediaTransitions {
  return (
    transitions
      // @ts-expect-error - .
      .reduce((p, c) => [...p, ...(isArray(c[0]) ? c : [c])], [])
      // @ts-expect-error - .
      .reduce(
        (previous, [event, transition]) => ({
          ...previous,
          [event]: transition
        }),
        {}
      )
  );
}

function loadingTransition() {
  return mediaTransition('loading', 'loading', [
    assign((ctx, { trigger }) => ({
      ...ctx,
      currentSrc: trigger.detail.src,
      currentPoster: trigger.detail.poster,
      mediaType: trigger.detail.mediaType,
      viewType: trigger.detail.viewType
    }))
  ]);
}

function loadedTransition() {
  return mediaTransition('loaded', 'loaded', [
    assign({ currentSrc: (_, { trigger }) => trigger.detail.src })
  ]);
}

function abortedTransition() {
  return mediaTransition('abort', 'aborted', [
    assign({ error: (_, { trigger }) => trigger.error })
  ]);
}

function waitingTransition() {
  return mediaTransition('waiting', 'waiting', [
    assign({ waiting: (_) => true })
  ]);
}

function canPlayTransition() {
  return mediaTransition('can-play', 'paused', [
    assign((ctx, { trigger }) => ({
      ...ctx,
      canPlay: true,
      duration: trigger.detail.duration,
      autoplayError: undefined
    }))
  ]);
}

function autoplayTransition() {
  return mediaTransition('autoplay', 'autoplay', [
    assign({ autoplayError: (_) => undefined })
  ]);
}

function autoplayFailTransition() {
  return mediaTransition('autoplay-fail', 'autoplay-fail', [
    assign({ autoplayError: (_, { trigger }) => trigger.detail })
  ]);
}

function canPlayThroughTransition() {
  return mediaTransition('can-play', 'paused', [
    assign((ctx, { trigger }) => ({
      ...ctx,
      canPlayThrough: trigger.type === 'vds-can-play-through',
      duration: trigger.detail.duration
    }))
  ]);
}

function pauseTransition() {
  return mediaTransition('pause', 'paused', [
    assign((ctx, { trigger }) => ({
      ...ctx,
      paused: true,
      playing: false,
      seeking: false,
      waiting: false,
      currentTime:
        trigger.type === 'vds-seeked'
          ? (trigger as SeekedEvent).detail
          : ctx.currentTime
    }))
  ]);
}

function playTransition() {
  return mediaTransition('play', 'play', [assign({ paused: (_) => false })]);
}

function playFailedTransition() {
  return mediaTransition('play-fail', 'paused', [
    assign((ctx, { trigger }) => ({
      ...ctx,
      paused: true,
      playing: false,
      waiting: false,
      error: trigger.detail
    }))
  ]);
}

function playingTransition() {
  return mediaTransition('playing', 'playing', [
    assign((ctx) => ({
      ...ctx,
      paused: false,
      playing: true,
      waiting: false,
      seeking: false,
      started: true
    }))
  ]);
}

function timeUpdateTransition() {
  return mediaTransition('time-update', 'playing', [
    assign({
      currentTime: (_, { trigger }) => trigger.detail
    })
  ]);
}

function seekingTransition() {
  return mediaTransition('seeking', 'seeking', [
    assign((ctx, { trigger }) => ({
      ...ctx,
      currentTime: trigger.detail,
      seeking: true
    }))
  ]);
}

function endedTransition() {
  return mediaTransition('ended', 'ended', [
    assign((ctx) => ({
      ...ctx,
      paused: true,
      playing: false,
      ended: true,
      seeking: false,
      waiting: false
    }))
  ]);
}

function srcChangeTransition() {
  return mediaTransition('src-change', 'idle', [
    assign(
      (
        {
          autoplay,
          controls,
          playsinline,
          viewType,
          currentPoster,
          loop,
          volume
        },
        { trigger }
      ) => ({
        // Reset everything except the properties below.
        ...mediaMachineContext,
        currentSrc: trigger.detail,
        autoplay,
        controls,
        playsinline,
        viewType,
        currentPoster,
        loop,
        volume
      })
    )
  ]);
}

/**
 * Basic property change transitions that can happen at essentially any point in the
 * media state flow. All of these are self transitions, meaning they'll transition back to
 * the given `currentState`.
 */
function propertyChangeTransitions(currentState: MediaMachineState) {
  function selfTransition<Event extends MediaMachineEventType>(
    event: Event,
    ...actions: MediaAction<Event>[]
  ) {
    return mediaTransition(event, currentState, actions);
  }

  return [
    selfTransition(
      'autoplay-change',
      assign({ autoplay: (_, { trigger }) => trigger.detail })
    ),
    selfTransition(
      'volume-change',
      assign((ctx, { trigger }) => ({
        ...ctx,
        volume: trigger.detail.volume,
        muted: trigger.detail.muted
      }))
    ),
    selfTransition(
      'error',
      assign({ error: (_, { trigger }) => trigger.detail })
    ),
    selfTransition(
      'fullscreen-support-change',
      assign({ canRequestFullscreen: (_, { trigger }) => trigger.detail })
    ),
    selfTransition(
      'poster-change',
      assign({ currentPoster: (_, { trigger }) => trigger.detail })
    ),
    selfTransition(
      'loop-change',
      assign({ loop: (_, { trigger }) => trigger.detail })
    ),
    selfTransition(
      'playsinline-change',
      assign({ playsinline: (_, { trigger }) => trigger.detail })
    ),
    selfTransition(
      'controls-change',
      assign({ controls: (_, { trigger }) => trigger.detail })
    )
  ];
}

/**
 * List of all player transitions that can happen once media is ready for playback. All states
 * here transition back to the given current state, except when the media source is changed,
 * that will transition back to the `idle` state.
 */
function mediaReadyTransitions(currentState: MediaMachineState) {
  function selfTransition<Event extends MediaMachineEventType>(
    event: Event,
    ...actions: MediaAction<Event>[]
  ) {
    return mediaTransition(event, currentState, actions);
  }

  return [
    srcChangeTransition(),
    progressTransition(currentState),
    selfTransition(
      'fullscreen-change',
      assign({ fullscreen: (_, { trigger }) => trigger.detail })
    )
  ];
}

function progressTransition(currentState: MediaMachineState) {
  return mediaTransition('progress', currentState, [
    assign((ctx, { trigger }) => {
      const { buffered, seekable } = trigger.detail;

      const bufferedAmount =
        buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);

      const seekableAmount =
        seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);

      return {
        ...ctx,
        buffered,
        bufferedAmount:
          bufferedAmount > ctx.duration ? ctx.duration : bufferedAmount,
        seekable,
        seekableAmount:
          seekableAmount > ctx.duration ? ctx.duration : seekableAmount
      };
    })
  ]);
}

export type MediaService = StateMachine.Service<
  MediaMachineContext,
  MediaMachineEvents,
  MediaMachineStates
>;

export function createMediaService(): MediaService {
  return interpret(mediaMachine);
}

export const mediaServiceContext = createContext(() => createMediaService());

export function hostedMediaServiceSubscription(
  host: ReactiveControllerHost & EventTarget,
  onChange: (state: ReturnType<typeof createMediaService>['state']) => void
) {
  hostedServiceSubscription(host, mediaServiceContext, onChange);
}
