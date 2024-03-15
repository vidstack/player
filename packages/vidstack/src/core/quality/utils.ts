import type { VideoQuality } from './video-quality';

export function sortVideoQualities(qualities: VideoQuality[], desc?: boolean) {
  return [...qualities].sort(desc ? compareVideoQualityDesc : compareVideoQualityAsc);
}

function compareVideoQualityAsc(a: VideoQuality, b: VideoQuality) {
  return a.height === b.height ? (a.bitrate ?? 0) - (b.bitrate ?? 0) : a.height - b.height;
}

function compareVideoQualityDesc(a: VideoQuality, b: VideoQuality) {
  return b.height === a.height ? (b.bitrate ?? 0) - (a.bitrate ?? 0) : b.height - a.height;
}
