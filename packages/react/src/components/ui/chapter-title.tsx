import { useActiveTextCues } from '../../hooks/use-active-text-cues';
import { useActiveTextTrack } from '../../hooks/use-active-text-track';
import { useMediaState } from '../../hooks/use-media-state';

/* -------------------------------------------------------------------------------------------------
 * Chapter Title
 * -----------------------------------------------------------------------------------------------*/

export interface ChapterTitleProps {}

/**
 * This component is used to load and display the current chapter title based on the text tracks
 * provided.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/display/chapter-title}
 */

function ChapterTitle(): string {
  const $started = useMediaState('started'),
    $title = useMediaState('title'),
    track = useActiveTextTrack('chapters'),
    cues = useActiveTextCues(track);
  return $started ? cues[0]?.text || $title : $title;
}

ChapterTitle.displayName = 'ChapterTitle';
export { ChapterTitle };
