/**
 * Matches channel names:
 * https://www.twitch.tv/example
 * https://player.twitch.tv/?channel=example
 * twitch/example
 * -> match group is "example"
 * (Specifically excludes twitch.tv/video and twitch.tv/videos, sorry if someone wants to embed those channels)
 */
const channelNameRE = /(?:twitch\.tv\/|player\.twitch\.tv\/\?channel=|twitch\/)(?!videos?)(\w+)$/;

/**
 * Matches video IDs:
 * https://www.twitch.tv/videos/123456789
 * https://player.twitch.tv/?video=123456789
 * twitch/video/123456789
 * -> match group is "123456789"
 */
const videoIdRE = /(?:twitch\.tv\/videos\/|player\.twitch\.tv\/\?video=|twitch\/video\/)(\d+)/;

export function resolveTwitchSource(src: string): {
  channel?: string;
  videoId?: string;
} {
  const videoIdMatch = src.match(videoIdRE);

  if (videoIdMatch) {
    return {
      videoId: videoIdMatch[1],
    };
  }

  const channelMatch = src.match(channelNameRE);

  if (channelMatch) {
    return {
      channel: channelMatch[1],
    };
  }

  return {};
}
