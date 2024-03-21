import type * as DASH from 'dashjs';

import type { DashProviderEvents } from './events';

export { type DashProviderEvents };

export type DashConstructor = typeof DASH.MediaPlayer;
export type DashConstructorLoader = () => Promise<{ default: DashConstructor } | undefined>;
export type DashLibrary = DashConstructor | DashConstructorLoader | string | undefined;
export type DashInstanceCallback = (player: DASH.MediaPlayerClass) => void;

