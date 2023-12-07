import type { MediaSrc } from 'vidstack';

import type { RemotionProvider } from './provider';
import type { RemotionMediaResource } from './types';

/** @see {@link https://www.vidstack.io/docs/player/providers/remotion} */
export function isRemotionProvider(provider: any): provider is RemotionProvider {
  return provider?.$$PROVIDER_TYPE === 'REMOTION';
}

export function isRemotionSource(src?: MediaSrc | null): src is RemotionMediaResource {
  return src?.type === 'video/remotion';
}
