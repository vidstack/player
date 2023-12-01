export type YouTubePlaybackQuality =
  | 'unknown'
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'hd720'
  | 'hd1080'
  | 'highres'
  | 'max';

export function mapYouTubePlaybackQuality(quality: YouTubePlaybackQuality) {
  switch (quality) {
    case 'unknown':
      return undefined;
    case 'tiny':
      return 144;
    case 'small':
      return 240;
    case 'medium':
      return 360;
    case 'large':
      return 480;
    case 'hd720':
      return 720;
    case 'hd1080':
      return 1080;
    case 'highres':
      return 1440;
    case 'max':
      return 2160;
    default:
      return undefined;
  }
}
