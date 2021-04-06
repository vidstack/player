import { WritablePlayerState } from '../player.types';

export type ProviderProps = WritablePlayerState;

export type ProviderRequestKey = string;

export type ProviderRequestAction = () => void | Promise<void>;

export type ProviderRequestQueue = Map<
  ProviderRequestKey,
  ProviderRequestAction
>;
