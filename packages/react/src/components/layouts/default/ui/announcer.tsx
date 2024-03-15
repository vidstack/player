import * as React from 'react';

import { useSignal } from 'maverick.js/react';

import { MediaAnnouncer } from '../../../announcer';
import { useDefaultLayoutContext } from '../context';

/* -------------------------------------------------------------------------------------------------
 * DefaultAnnouncer
 * -----------------------------------------------------------------------------------------------*/

function DefaultAnnouncer() {
  const { userPrefersAnnouncements, translations } = useDefaultLayoutContext(),
    $userPrefersAnnouncements = useSignal(userPrefersAnnouncements);

  if (!$userPrefersAnnouncements) return null;

  return <MediaAnnouncer translations={translations} />;
}

DefaultAnnouncer.displayName = 'DefaultAnnouncer';
export { DefaultAnnouncer };
