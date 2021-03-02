export type MediaFileProviderEngine = HTMLMediaElement | undefined;

export type MediaCrossOriginOption = 'anonymous' | 'use-credentials';

export type MediaPreloadOption = 'none' | 'metadata' | 'auto';

// V8ToIstanbul fails when no value is exported.
export default class {}
