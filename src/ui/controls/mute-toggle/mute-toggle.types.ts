import { Callback } from '../../../shared/types';
import { ToggleControlProps } from '../toggle-control';

export type MuteToggleProps = ToggleControlProps;

export interface MuteToggleFakeProps {
  fakeMuted: boolean;
}

export interface MuteToggleActions {
  onUserMutedChange: Callback<CustomEvent>;
}
