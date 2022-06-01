import { uppercaseFirstLetter } from '@vidstack/foundation';
import { writable } from 'svelte/store';

export type MediaProviderType = 'audio' | 'video' | 'hls';

export const mediaProviders: MediaProviderType[] = ['audio', 'video', 'hls'];

export const mediaProvider = writable<MediaProviderType>('video');

export function titleCaseMediaProvider(provider: MediaProviderType) {
  if (provider === 'hls') return 'HLS';
  return uppercaseFirstLetter(provider);
}
