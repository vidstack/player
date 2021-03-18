import {
  VdsAbortEvent,
  VdsCanPlayEvent,
  VdsCanPlayThroughEvent,
  VdsConnectEvent,
  VdsDisconnectEvent,
  VdsDurationChangeEvent,
  VdsEmpitedEvent,
  VdsEndedEvent,
  VdsErrorEvent,
  VdsLoadedDataEvent,
  VdsLoadedMetadataEvent,
  VdsLoadStartEvent,
  VdsMediaTypeChangeEvent,
  VdsPauseEvent,
  VdsPlayEvent,
  VdsPlayingEvent,
  VdsProgressEvent,
  VdsReplayEvent,
  VdsSeekedEvent,
  VdsSeekingEvent,
  VdsStalledEvent,
  VdsStartedEvent,
  VdsSuspendEvent,
  VdsTimeUpdateEvent,
  VdsViewTypeChangeEvent,
  VdsVolumeChangeEvent,
  VdsWaitingEvent,
} from '../../core';
import { Callback } from '../../shared/types';
import { VdsFullscreenChangeEvent } from '../player.events';

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
  onAbort: Callback<CustomEvent>;
  onCanPlay: Callback<CustomEvent>;
  onCanPlayThrough: Callback<CustomEvent>;
  onConnect: Callback<CustomEvent>;
  onDisconnect: Callback<CustomEvent>;
  onDurationChange: Callback<CustomEvent>;
  onEmptied: Callback<CustomEvent>;
  onEnded: Callback<CustomEvent>;
  onError: Callback<CustomEvent>;
  onFullscreenChange: Callback<CustomEvent>;
  onLoadedData: Callback<CustomEvent>;
  onLoadedMetadata: Callback<CustomEvent>;
  onLoadStart: Callback<CustomEvent>;
  onMediaTypeChange: Callback<CustomEvent>;
  onPause: Callback<CustomEvent>;
  onPlay: Callback<CustomEvent>;
  onPlaying: Callback<CustomEvent>;
  onProgress: Callback<CustomEvent>;
  onSeeked: Callback<CustomEvent>;
  onSeeking: Callback<CustomEvent>;
  onStalled: Callback<CustomEvent>;
  onStarted: Callback<CustomEvent>;
  onSuspend: Callback<CustomEvent>;
  onReplay: Callback<CustomEvent>;
  onTimeUpdate: Callback<CustomEvent>;
  onViewTypeChange: Callback<CustomEvent>;
  onVolumeChange: Callback<CustomEvent>;
  onWaiting: Callback<CustomEvent>;
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
  onAbort: {
    action: VdsAbortEvent.TYPE,
  },
  onCanPlay: {
    action: VdsCanPlayEvent.TYPE,
  },
  onCanPlayThrough: {
    action: VdsCanPlayThroughEvent.TYPE,
  },
  onConnect: {
    action: VdsConnectEvent.TYPE,
  },
  onDisconnect: {
    action: VdsDisconnectEvent.TYPE,
  },
  onDurationChange: {
    action: VdsDurationChangeEvent.TYPE,
  },
  onEmptied: {
    action: VdsEmpitedEvent.TYPE,
  },
  onEnded: {
    action: VdsEndedEvent.TYPE,
  },
  onError: {
    action: VdsErrorEvent.TYPE,
  },
  onFullscreenChange: {
    action: VdsFullscreenChangeEvent.TYPE,
  },
  onLoadedData: {
    action: VdsLoadedDataEvent.TYPE,
  },
  onLoadedMetaData: {
    action: VdsLoadedMetadataEvent.TYPE,
  },
  onLoadStart: {
    action: VdsLoadStartEvent.TYPE,
  },
  onMediaTypeChange: {
    action: VdsMediaTypeChangeEvent.TYPE,
  },
  onPause: {
    action: VdsPauseEvent.TYPE,
  },
  onPlay: {
    action: VdsPlayEvent.TYPE,
  },
  onPlaying: {
    action: VdsPlayingEvent.TYPE,
  },
  onProgress: {
    action: VdsProgressEvent.TYPE,
  },
  onSeeked: {
    action: VdsSeekedEvent.TYPE,
  },
  onSeeking: {
    action: VdsSeekingEvent.TYPE,
  },
  onStalled: {
    action: VdsStalledEvent.TYPE,
  },
  onStarted: {
    action: VdsStartedEvent.TYPE,
  },
  onSuspend: {
    action: VdsSuspendEvent.TYPE,
  },
  onReplay: {
    action: VdsReplayEvent.TYPE,
  },
  onTimeUpdate: {
    action: VdsTimeUpdateEvent.TYPE,
  },
  onViewTypeChange: {
    action: VdsViewTypeChangeEvent.TYPE,
  },
  onVolumeChange: {
    action: VdsVolumeChangeEvent.TYPE,
  },
  onWaiting: {
    action: VdsWaitingEvent.TYPE,
  },
};
