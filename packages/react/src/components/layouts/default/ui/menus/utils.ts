import * as React from 'react';

import { useSignal } from 'maverick.js/react';

import { useDefaultLayoutContext } from '../../context';

export function useParentDialogEl() {
  const { layoutEl } = useDefaultLayoutContext(),
    $layoutEl = useSignal(layoutEl);

  return React.useMemo(() => $layoutEl?.closest('dialog'), [$layoutEl]);
}
