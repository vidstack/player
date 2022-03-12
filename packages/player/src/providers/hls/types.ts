import type Hls from 'hls.js';

export type HlsConstructor = typeof Hls;

export type DynamicHlsConstructorImport = () => Promise<{ default: HlsConstructor } | undefined>;
