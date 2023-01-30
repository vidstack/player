import { AUDIO_PROVIDER, type AudioProvider } from './audio/provider';
import { HLS_PROVIDER, type HLSProvider } from './hls/provider';
import { VIDEO_PROVIDER, type VideoProvider } from './video/provider';

export function isAudioProvider(provider: unknown): provider is AudioProvider {
  return !!provider?.[AUDIO_PROVIDER];
}

export function isVideoProvider(provider: unknown): provider is VideoProvider {
  return !!provider?.[VIDEO_PROVIDER];
}

export function isHLSProvider(provider: unknown): provider is HLSProvider {
  return !!provider?.[HLS_PROVIDER];
}
