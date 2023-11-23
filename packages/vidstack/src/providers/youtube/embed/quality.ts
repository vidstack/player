export const enum YouTubePlaybackQuality {
  Unknown = 'unknown',
  Tiny = 'tiny',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Hd720 = 'hd720',
  Hd1080 = 'hd1080',
  Highres = 'highres',
  Max = 'max',
}

export function mapYouTubePlaybackQuality(quality: YouTubePlaybackQuality) {
  switch (quality) {
    case YouTubePlaybackQuality.Unknown:
      return undefined;
    case YouTubePlaybackQuality.Tiny:
      return 144;
    case YouTubePlaybackQuality.Small:
      return 240;
    case YouTubePlaybackQuality.Medium:
      return 360;
    case YouTubePlaybackQuality.Large:
      return 480;
    case YouTubePlaybackQuality.Hd720:
      return 720;
    case YouTubePlaybackQuality.Hd1080:
      return 1080;
    case YouTubePlaybackQuality.Highres:
      return 1440;
    case YouTubePlaybackQuality.Max:
      return 2160;
    default:
      return undefined;
  }
}
