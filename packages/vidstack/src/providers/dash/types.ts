import type * as DASH from 'dashjs';

import type { DASHProviderEvents } from './events';

export { type DASHProviderEvents };

export type DASHConstructor = typeof DASH.MediaPlayer;
export type DASHConstructorLoader = () => Promise<{ default: DASHConstructor } | undefined>;
export type DASHLibrary = DASHConstructor | DASHConstructorLoader | string | undefined;
export type DASHInstanceCallback = (player: DASH.MediaPlayerClass) => void;
