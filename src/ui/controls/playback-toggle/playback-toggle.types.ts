import { Callback } from '../../../shared/types';
import { ToggleControlProps } from '../toggle-control';

export type PlaybackToggleProps = ToggleControlProps;

export interface PlaybackToggleActions {
  onUserPlay: Callback<CustomEvent>;
  onUserPause: Callback<CustomEvent>;
}

export interface PlaybackToggleFakeProps {
  fakePaused: boolean;
}
