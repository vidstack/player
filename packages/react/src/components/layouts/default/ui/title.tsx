import * as React from 'react';

import { useActiveTextTrack } from '../../../../hooks/use-active-text-track';
import { useMediaState } from '../../../../hooks/use-media-state';
import { ChapterTitle } from '../../../ui/chapter-title';
import { Title } from '../../../ui/title';

/* -------------------------------------------------------------------------------------------------
 * DefaultTitle
 * -----------------------------------------------------------------------------------------------*/

function DefaultTitle() {
  const $started = useMediaState('started'),
    $title = useMediaState('title'),
    $hasChapters = useActiveTextTrack('chapters');
  return $hasChapters && ($started || !$title) ? (
    <ChapterTitle className="vds-chapter-title" />
  ) : (
    <Title className="vds-chapter-title" />
  );
}

DefaultTitle.displayName = 'DefaultTitle';
export { DefaultTitle };
