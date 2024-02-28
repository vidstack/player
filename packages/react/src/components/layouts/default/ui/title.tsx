import * as React from 'react';

import { ChapterTitle } from '../../../ui/chapter-title';
import { Title } from '../../../ui/title';

/* -------------------------------------------------------------------------------------------------
 * DefaultTitle
 * -----------------------------------------------------------------------------------------------*/

function DefaultTitle() {
  return <Title className="vds-title" />;
}

DefaultTitle.displayName = 'DefaultTitle';
export { DefaultTitle };

/* -------------------------------------------------------------------------------------------------
 * DefaultChapterTitle
 * -----------------------------------------------------------------------------------------------*/

function DefaultChapterTitle() {
  return <ChapterTitle className="vds-chapter-title" />;
}

DefaultChapterTitle.displayName = 'DefaultChapterTitle';
export { DefaultChapterTitle };
