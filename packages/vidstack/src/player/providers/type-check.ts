import type { Maybe } from 'maverick.js';

import type { AudioElement } from './audio/types';
import type { HLSVideoElement } from './hls/types';
import type { VideoElement } from './video/types';

export function isAudioElement(node: Maybe<Element>): node is AudioElement {
  return !!node && node.localName === 'vds-audio';
}

export function isVideoElement(node: Maybe<Element>): node is VideoElement {
  return !!node && node.localName === 'vds-video';
}

export function isHLSVideoElement(node: Maybe<Element>): node is HLSVideoElement {
  return !!node && node.localName === 'vds-hls-video';
}
