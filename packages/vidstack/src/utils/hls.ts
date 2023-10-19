import type { MediaStreamType } from '../core';

export function resolveStreamTypeFromHLSManifest(
  manifestSrc: string,
  requestInit?: RequestInit,
): Promise<MediaStreamType> {
  return fetch(manifestSrc, requestInit)
    .then((res) => res.text())
    .then((manifest) => {
      const renditionURI = resolveHLSRenditionURI(manifest);
      if (renditionURI) {
        return resolveStreamTypeFromHLSManifest(
          /^https?:/.test(renditionURI) ? renditionURI : new URL(renditionURI, manifestSrc).href,
          requestInit,
        );
      }

      const streamType = /EXT-X-PLAYLIST-TYPE:\s*VOD/.test(manifest) ? 'on-demand' : 'live';

      if (
        streamType === 'live' &&
        resolveTargetDuration(manifest) >= 10 &&
        (/#EXT-X-DVR-ENABLED:\s*true/.test(manifest) || manifest.includes('#EXT-X-DISCONTINUITY'))
      ) {
        return 'live:dvr';
      }

      return streamType;
    });
}

function resolveHLSRenditionURI(manifest: string) {
  const matches = manifest.match(/#EXT-X-STREAM-INF:[^\n]+(\n[^\n]+)*/g);
  return matches ? matches[0].split('\n')[1].trim() : null;
}

function resolveTargetDuration(manifest: string): number {
  const lines = manifest.split('\n');

  for (const line of lines) {
    if (line.startsWith('#EXT-X-TARGETDURATION')) {
      const duration = parseFloat(line.split(':')[1]);
      if (!isNaN(duration)) {
        return duration;
      }
    }
  }

  return -1;
}
