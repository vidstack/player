import type { VimeoOEmbedData, VimeoVideoInfo } from './embed/misc';

const videoIdRE =
  /(?:https:\/\/)?(?:player\.)?vimeo(?:\.com)?\/(?:video\/)?(\d+)(?:(?:\?hash=|\?h=|\/)(.*))?/;

const infoCache = new Map<string, VimeoVideoInfo>();

const pendingFetch = new Map<string, Promise<VimeoVideoInfo>>();

const posterMaxSize = 1920;

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
      const info = {
        title: data?.title ?? '',
        duration: data?.duration ?? 0,
        poster: resolveVimeoPoster(data),
        pro: data.account_type !== 'basic',
      };

      infoCache.set(videoId, info);
      return info;
    })
    .finally(() => pendingFetch.delete(videoId));

  pendingFetch.set(videoId, promise);
  return promise;
}

function resolveVimeoPoster(data: VimeoOEmbedData) {
  const thumbnailUrl = data?.thumbnail_url ?? '',
    thumbnailId = thumbnailUrl.match(/vimeocdn\.com\/video\/([^_/?#]+)_/)?.[1];

  if (!thumbnailId) return thumbnailUrl;

  const dimensions = resolvePosterDimensions(data);

  return dimensions
    ? `https://i.vimeocdn.com/video/${thumbnailId}_${dimensions.width}x${dimensions.height}.webp`
    : thumbnailUrl;
}

function resolvePosterDimensions(data: VimeoOEmbedData) {
  const width = data.width || data.thumbnail_width,
    height = data.height || data.thumbnail_height;

  if (!width || !height) return null;

  if (width > height) {
    return {
      width: posterMaxSize,
      height: Math.round((posterMaxSize * height) / width),
    };
  }

  return {
    width: Math.round((posterMaxSize * width) / height),
    height: posterMaxSize,
  };
}
