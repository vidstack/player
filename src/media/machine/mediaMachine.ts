import { assign, createMachine, interpret, StateMachine } from '@xstate/fsm';
import { ReactiveControllerHost } from 'lit';

import { createContext } from '../../base/context';
import { hostedServiceSubscription } from '../../base/machine';
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
        propertyChangeTransitions('loading')
      )
    },
    loaded: {
      on: transitions(canPlayTransition(), propertyChangeTransitions('loaded'))
    },
    'can-play': {
      on: transitions(
        canPlayThroughTransition(),
        pauseTransition(),
        propertyChangeTransitions('can-play'),
        mediaReadyTransitions('can-play'),
        autoplayTransition()
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
        pauseTransition(),
        playTransition(),
        seekingTransition(),
        propertyChangeTransitions('autoplay-fail'),
        mediaReadyTransitions('autoplay-fail')
      )
    },
    paused: {
      on: transitions(
        playTransition(),
        seekingTransition(),
        propertyChangeTransitions('paused'),
        mediaReadyTransitions('paused')
      )
    },
    play: {
      on: transitions(
        waitingTransition(),
        playingTransition(),
        playFailedTransition(),
        seekingTransition(),
        propertyChangeTransitions('play'),
        mediaReadyTransitions('play')
      )
    },
    playing: {
      on: transitions(
        pauseTransition(),
        timeUpdateTransition(),
        waitingTransition(),
        endedTransition(),
        propertyChangeTransitions('playing'),
        mediaReadyTransitions('playing')
      )
    },
    seeking: {
      on: transitions(
        seekedTransition(),
        waitingTransition(),
        propertyChangeTransitions('seeking'),
        mediaReadyTransitions('seeking')
      )
    },
    seeked: {
      entry: [],
      on: transitions(
        pauseTransition(),
        playingTransition(),
        propertyChangeTransitions('seeked'),
        mediaReadyTransitions('seeked')
      )
    },
    waiting: {
      on: transitions(
        pauseTransition(),
        playingTransition(),
        seekedTransition(),
        propertyChangeTransitions('waiting'),
        mediaReadyTransitions('waiting')
      )
    },
    ended: {
      on: transitions(
        playTransition(),
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
  { type: Event } & MediaMachineEventPayload[Event]
>;

type MediaTransition<Event extends MediaMachineEventType> =
  StateMachine.Transition<
    MediaMachineContext,
    { type: Event } & MediaMachineEventPayload[Event]
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
  return transitions
    .flat()
    .reduce(
      (previous, [event, transition]) => ({ ...previous, [event]: transition }),
      {}
    );
}

function loadingTransition() {
  return mediaTransition('loading', 'loading', [
    assign((_, { src, poster, mediaType, viewType }) => ({
      currentSrc: src,
      currentPoster: poster,
      mediaType,
      viewType
    }))
  ]);
}

function loadedTransition() {
  return mediaTransition('loaded', 'loaded', [
    assign((_, { src }) => ({ currentSrc: src }))
  ]);
}

function abortedTransition() {
  return mediaTransition('abort', 'aborted', [
    assign((_, { error }) => ({ error }))
  ]);
}

function waitingTransition() {
  return mediaTransition('waiting', 'waiting', [
    assign((_) => ({ waiting: true }))
  ]);
}

function canPlayTransition() {
  return mediaTransition('can-play', 'can-play', [
    assign((_, { duration }) => ({
      canPlay: true,
      duration,
      autoplayError: undefined
    }))
  ]);
}

function autoplayTransition() {
  return mediaTransition('autoplay', 'autoplay', [
    assign((_) => ({ autoplayError: undefined }))
  ]);
}

function autoplayFailTransition() {
  return mediaTransition('autoplay-fail', 'autoplay-fail', [
    assign({ autoplayError: (_, { error }) => error })
  ]);
}

function canPlayThroughTransition() {
  return mediaTransition('can-play', 'can-play', [
    assign((_, { duration, trigger }) => ({
      canPlayThrough: trigger.type === 'vds-can-play-through',
      duration
    }))
  ]);
}

function pauseTransition() {
  return mediaTransition('pause', 'paused', [
    assign((_) => ({
      paused: true,
      playing: false,
      seeking: false,
      waiting: false
    }))
  ]);
}

function playTransition() {
  return mediaTransition('play', 'play', [
    assign((_) => ({
      paused: false
    }))
  ]);
}

function playFailedTransition() {
  return mediaTransition('play-fail', 'paused', [
    assign((_, { error }) => ({
      paused: true,
      playing: false,
      waiting: false,
      error
    }))
  ]);
}

function playingTransition() {
  return mediaTransition('playing', 'playing', [
    assign((_) => ({
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
    assign((_, { trigger }) => ({
      currentTime: trigger.detail
    }))
  ]);
}

function seekingTransition() {
  return mediaTransition('seeking', 'seeking', [
    assign((_, { trigger }) => ({
      currentTime: trigger.detail,
      seeking: true
    }))
  ]);
}

function seekedTransition() {
  return mediaTransition('seeked', 'seeked', [
    assign((_, { trigger }) => ({
      currentTime: trigger.detail,
      seeking: false,
      waiting: false
    }))
  ]);
}

function endedTransition() {
  return mediaTransition('ended', 'ended', [
    assign((_) => ({
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
        { src }
      ) => ({
        // Reset everything except the properties below.
        ...mediaMachineContext,
        currentSrc: src,
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
      assign((_, { autoplay }) => ({ autoplay }))
    ),
    selfTransition(
      'volume-change',
      assign((_, { trigger }) => ({
        volume: trigger.detail.volume,
        muted: trigger.detail.muted
      }))
    ),
    selfTransition(
      'error',
      assign((_, { error }) => ({ error }))
    ),
    selfTransition(
      'can-fullscreen',
      assign((_, { supported }) => ({
        canRequestFullscreen: supported
      }))
    ),
    selfTransition(
      'poster-change',
      assign((_, { poster }) => ({ currentPoster: poster }))
    ),
    selfTransition(
      'loop-change',
      assign((_, { loop }) => ({ loop }))
    ),
    selfTransition(
      'playsinline-change',
      assign((_, { playsinline }) => ({ playsinline }))
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
    selfTransition(
      'progress',
      assign(({ duration }, { buffered, seekable }) => {
        const bufferedAmount =
          buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);

        const seekableAmount =
          seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);

        return {
          buffered,
          bufferedAmount: bufferedAmount > duration ? duration : bufferedAmount,
          seekable,
          seekableAmount: seekableAmount > duration ? duration : seekableAmount
        };
      })
    ),
    selfTransition(
      'fullscreen-change',
      assign((_, { fullscreen }) => ({ fullscreen }))
    )
  ];
}

export function createMediaService() {
  return interpret(mediaMachine);
}

export const mediaServiceContext = createContext(() => createMediaService());

export function hostedMediaServiceSubscription(
  host: ReactiveControllerHost & EventTarget,
  onChange: (state: ReturnType<typeof createMediaService>['state']) => void
) {
  hostedServiceSubscription(host, mediaServiceContext, onChange);
}
