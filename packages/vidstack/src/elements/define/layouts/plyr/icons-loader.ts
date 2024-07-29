import type { TemplateResult } from 'lit-html';

import { Icon } from '../../../icon';
import { LayoutIconsLoader } from '../icons/layout-icons-loader';

export class PlyrLayoutIconsLoader extends LayoutIconsLoader {
  async loadIcons() {
    const paths = (await import('./icons')).icons,
      icons: Record<string, TemplateResult> = {};

    for (const iconName of Object.keys(paths)) {
      icons[iconName] = Icon({
        name: iconName,
        paths: paths[iconName],
        viewBox: '0 0 18 18',
      });
    }

    return icons;
  }
}
