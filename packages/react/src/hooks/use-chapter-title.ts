import { useActiveTextCues } from './use-active-text-cues';
import { useActiveTextTrack } from './use-active-text-track';

/**
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-chapter-title}
 */
export function useChapterTitle(): string {
  const $track = useActiveTextTrack('chapters'),
    $cues = useActiveTextCues($track);

  return $cues[0]?.text || '';
}
