import { Callback } from '../../../shared/types';
import { ToggleControlProps } from '../toggle-control';

export type FullscreenToggleProps = ToggleControlProps;

export interface FullscreenToggleFakeProps {
  fakeFullscreen: boolean;
}

export interface FullscreenToggleActions {
  onUserFullscreenChange: Callback<CustomEvent>;
}
