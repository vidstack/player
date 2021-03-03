import type Hls from 'hls.js';

import { EngineAttachEvent, EngineBuildEvent } from '../../core';
import { buildVdsEvent } from '../../shared/events';

export class HlsEngineBuildEvent extends buildVdsEvent<Hls>(
  EngineBuildEvent.TYPE,
) {}

export class HlsEngineAttachEvent extends buildVdsEvent<Hls>(
  EngineAttachEvent.TYPE,
) {}
