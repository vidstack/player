export type {
  AnyMediaProvider,
  MediaProviderAdapter,
  MediaFullscreenAdapter,
  MediaProviderLoader,
} from '../providers/types';

export * from '../providers/type-check';

// Audio
export { AudioProviderLoader } from '../providers/audio/loader';
export type { AudioProvider } from '../providers/audio/provider';

// Video
export type * from '../providers/video/presentation/events';
export { VideoProviderLoader } from '../providers/video/loader';
export type { VideoProvider } from '../providers/video/provider';

// HLS
export type * from '../providers/hls/events';
export type * from '../providers/hls/types';
export type { HLSProvider } from '../providers/hls/provider';
export { HLSProviderLoader } from '../providers/hls/loader';

// DASH
export type * from '../providers/dash/events';
export type * from '../providers/dash/types';
export { DASHProviderLoader } from '../providers/dash/loader';
export type { DASHProvider } from '../providers/dash/provider';

// Google Cast
export type { GoogleCastLoader } from '../providers/google-cast/loader';
export type { GoogleCastProvider } from '../providers/google-cast/provider';
export type * from '../providers/google-cast/events';

// Vimeo
export { VimeoProviderLoader } from '../providers/vimeo/loader';
export type { VimeoProvider } from '../providers/vimeo/provider';

// YouTube
export { YouTubeProviderLoader } from '../providers/youtube/loader';
export type { YouTubeProvider } from '../providers/youtube/provider';
