import type { TemplateResult } from 'lit-html';

import { Icon } from '../../../icon';
import { LayoutIconsLoader } from '../icons/layout-icons-loader';

export class DefaultLayoutIconsLoader extends LayoutIconsLoader {
  async _load() {
    const paths = (await import('./icons')).icons,
      icons: Record<string, TemplateResult> = {};

    for (const iconName of Object.keys(paths)) {
      icons[iconName] = Icon({ name: iconName, paths: paths[iconName] });
    }

    return icons;
  }
}
