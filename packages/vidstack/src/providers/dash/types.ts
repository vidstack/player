import type DASH from 'dashjs';

import type { DASHProviderEvents } from './events';

export { type DASHProviderEvents };

export type DASHConstructor = typeof DASH.MediaPlayer;
export type DASHConstructorLoader = () => Promise<{ default: DASHConstructor } | undefined>;

export type DASHNamespace = typeof DASH;
export type DASHNamespaceLoader = () => Promise<{ default: typeof DASH } | undefined>;

export type DASHLibrary =
  | DASHConstructor
  | DASHConstructorLoader
  | DASHNamespace
  | DASHNamespaceLoader
  | string
  | undefined;

export type DASHInstanceCallback = (player: DASH.MediaPlayerClass) => void;
