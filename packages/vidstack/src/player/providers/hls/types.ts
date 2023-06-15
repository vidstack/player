import type * as HLS from 'hls.js';

import type { HLSProviderEvents } from './events';

export { type HLSProviderEvents };

export type HLSConstructor = typeof HLS.default;
export type HLSConstructorLoader = () => Promise<{ default: HLSConstructor } | undefined>;
export type HLSLibrary = HLSConstructor | HLSConstructorLoader | string | undefined;
export type HLSInstanceCallback = (hls: HLS.default) => void;
