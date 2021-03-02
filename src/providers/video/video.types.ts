import { MediaFileProviderEngine } from '../file';

export type VideoProviderEngine = MediaFileProviderEngine;

export type VideoControlsList =
  | 'nodownload'
  | 'nofullscreen'
  | 'noremoteplayback';

// V8ToIstanbul fails when no value is exported.
export default class {}
