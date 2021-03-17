import { Callback } from '../../shared/types';
import {
  BufferedChangeEvent,
  BufferingChangeEvent,
  ConnectEvent,
  DisconnectEvent,
  DurationChangeEvent,
  ErrorEvent,
  MediaTypeChangeEvent,
  MutedChangeEvent,
  PauseEvent,
  PlaybackEndEvent,
  PlaybackReadyEvent,
  PlaybackStartEvent,
  PlayEvent,
  PlayingEvent,
  PosterChangeEvent,
  ReplayEvent,
  TimeChangeEvent,
  ViewTypeChangeEvent,
  VolumeChangeEvent,
} from '../player.events';

export interface ProviderProps {
  aspectRatio: string | undefined;
  paused: boolean;
  volume: number;
  currentTime: number;
  muted: boolean;
  playsinline: boolean;
  loop: boolean;
  controls: boolean;
}

export interface ProviderActions {
  onConnect: Callback<CustomEvent>;
  onDisconnect: Callback<CustomEvent>;
  onPause: Callback<CustomEvent>;
  onPlay: Callback<CustomEvent>;
  onPlaying: Callback<CustomEvent>;
  onPosterChange: Callback<CustomEvent>;
  onMutedChange: Callback<CustomEvent>;
  onVolumeChange: Callback<CustomEvent>;
  onTimeChange: Callback<CustomEvent>;
  onDurationChange: Callback<CustomEvent>;
  onBufferedChange: Callback<CustomEvent>;
  onBufferingChange: Callback<CustomEvent>;
  onViewTypeChange: Callback<CustomEvent>;
  onMediaTypeChange: Callback<CustomEvent>;
  onCanPlay: Callback<CustomEvent>;
  onPlaybackStart: Callback<CustomEvent>;
  onPlaybackEnd: Callback<CustomEvent>;
  onReplay: Callback<CustomEvent>;
  onError: Callback<CustomEvent>;
}

export type ProviderStorybookArgs = {
  [P in keyof ProviderProps & ProviderActions]: unknown;
};

export const PROVIDER_STORYBOOK_ARG_TYPES: ProviderStorybookArgs = {
  aspectRatio: {
    control: 'text',
  },
  paused: {
    control: 'boolean',
    defaultValue: true,
  },
  volume: {
    control: {
      type: 'number',
      step: 0.01,
    },
    defaultValue: 1,
  },
  currentTime: {
    control: 'number',
    defaultValue: 0,
  },
  muted: {
    control: 'boolean',
    defaultValue: false,
  },
  playsinline: {
    control: 'boolean',
    defaultValue: false,
  },
  loop: {
    control: 'boolean',
    defaultValue: false,
  },
  controls: {
    control: 'boolean',
    defaultValue: false,
  },
  onConnect: {
    action: ConnectEvent.TYPE,
  },
  onDisconnect: {
    action: DisconnectEvent.TYPE,
  },
  onPause: {
    action: PauseEvent.TYPE,
  },
  onPlay: {
    action: PlayEvent.TYPE,
  },
  onPlaying: {
    action: PlayingEvent.TYPE,
  },
  onPosterChange: {
    action: PosterChangeEvent.TYPE,
  },
  onMutedChange: {
    action: MutedChangeEvent.TYPE,
  },
  onVolumeChange: {
    action: VolumeChangeEvent.TYPE,
  },
  onTimeChange: {
    action: TimeChangeEvent.TYPE,
  },
  onDurationChange: {
    action: DurationChangeEvent.TYPE,
  },
  onBufferedChange: {
    action: BufferedChangeEvent.TYPE,
  },
  onBufferingChange: {
    action: BufferingChangeEvent.TYPE,
  },
  onViewTypeChange: {
    action: ViewTypeChangeEvent.TYPE,
  },
  onMediaTypeChange: {
    action: MediaTypeChangeEvent.TYPE,
  },
  onPlaybackReady: {
    action: PlaybackReadyEvent.TYPE,
  },
  onPlaybackStart: {
    action: PlaybackStartEvent.TYPE,
  },
  onPlaybackEnd: {
    action: PlaybackEndEvent.TYPE,
  },
  onReplay: {
    action: ReplayEvent.TYPE,
  },
  onError: {
    action: ErrorEvent.TYPE,
  },
};
