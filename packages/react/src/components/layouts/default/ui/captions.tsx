import * as React from 'react';

import { Captions } from '../../../ui/captions';
import { useDefaultLayoutWord } from '../context';

/* -------------------------------------------------------------------------------------------------
 * DefaultCaptions
 * -----------------------------------------------------------------------------------------------*/

function DefaultCaptions() {
  const exampleText = useDefaultLayoutWord('Captions look like this');
  return <Captions className="vds-captions" exampleText={exampleText} />;
}

DefaultCaptions.displayName = 'DefaultCaptions';
export { DefaultCaptions };
