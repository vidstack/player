import type { ReadSignal } from 'maverick.js';
import arrowLeftPaths from 'media-icons/dist/icons/arrow-left.js';
import chevronRightPaths from 'media-icons/dist/icons/chevron-down.js';

import { Icon } from '../../../icons/icon';

export function renderMenuButtonContent({ label, iconPaths }: RenderMenuButtonContentProps) {
  return (
    <>
      <Icon slot="close-icon" paths={arrowLeftPaths} />
      <Icon slot="icon" paths={iconPaths} />
      <span slot="label">{label()}</span>
      <div slot="hint"></div>
      <Icon slot="open-icon" paths={chevronRightPaths} />
    </>
  );
}

export interface RenderMenuButtonContentProps {
  label: ReadSignal<string>;
  iconPaths: string;
}
