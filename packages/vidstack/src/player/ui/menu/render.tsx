import type { ReadSignal } from 'maverick.js';
import { arrowLeftPaths, chevronRightPaths } from 'media-icons';

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
