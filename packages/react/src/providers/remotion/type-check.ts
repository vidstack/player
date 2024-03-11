import type { Src } from 'vidstack';

import type { RemotionProvider } from './provider';
import type { RemotionSrc } from './types';

/** @see {@link https://www.vidstack.io/docs/player/providers/remotion} */
export function isRemotionProvider(provider: any): provider is RemotionProvider {
  return provider?.$$PROVIDER_TYPE === 'REMOTION';
}

export function isRemotionSrc(src?: Src | null): src is RemotionSrc {
  return src?.type === 'video/remotion';
}
