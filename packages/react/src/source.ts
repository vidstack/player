import type { PlayerSrc as BasePlayerSrc } from 'vidstack';

import type { RemotionMediaResource } from './providers/remotion/types';

export type PlayerSrc = BasePlayerSrc | RemotionMediaResource;
