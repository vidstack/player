import type { VimeoOEmbedData, VimeoVideoInfo } from './embed/misc';

const videoIdRE =
  /(?:https:\/\/)?(?:player\.)?vimeo(?:\.com)?\/(?:video\/)?(\d+)(?:(?:\?hash=|\?h=|\/)(.*))?/;

const infoCache = new Map<string, VimeoVideoInfo>();

const pendingFetch = new Map<string, Promise<VimeoVideoInfo>>();

export function resolveVimeoVideoId(src: string) {
  const matches = src.match(videoIdRE);
  return { videoId: matches?.[1], hash: matches?.[2] };
}

export async function getVimeoVideoInfo(
  videoId: string,
  abort: AbortController,
  videoHash?: string | null,
) {
  if (infoCache.has(videoId)) return infoCache.get(videoId)!;

  if (pendingFetch.has(videoId)) return pendingFetch.get(videoId);

  let oembedSrc = `https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/${videoId}`;
  if (videoHash) {
    oembedSrc = oembedSrc.concat(`?h=${videoHash}`);
  }

  const promise = window
    .fetch(oembedSrc, {
      mode: 'cors',
      signal: abort.signal,
    })
    .then((response) => response.json())
    .then((data: VimeoOEmbedData) => {
      const thumnailRegex = /vimeocdn.com\/video\/(.*)?_/,
        thumbnailId = data?.thumbnail_url?.match(thumnailRegex)?.[1],
        poster = thumbnailId ? `https://i.vimeocdn.com/video/${thumbnailId}_1920x1080.webp` : '',
        info = {
          title: data?.title ?? '',
          duration: data?.duration ?? 0,
          poster,
          pro: data.account_type !== 'basic',
        };

      infoCache.set(videoId, info);
      return info;
    })
    .finally(() => pendingFetch.delete(videoId));

  pendingFetch.set(videoId, promise);
  return promise;
}
