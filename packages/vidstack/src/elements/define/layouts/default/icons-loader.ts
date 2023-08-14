import type { TemplateResult } from 'lit-html';
import { Icon } from '../../../icon';
import { TemplateIconsLoader } from '../icons/template-icons-loader';

export class DefaultLayoutIconsLoader extends TemplateIconsLoader {
  protected override _resolveIcons(id: string) {
    return id === '' ? this._loadDefaultIcons() : super._resolveIcons(id);
  }

  protected async _loadDefaultIcons() {
    const paths = (await import('./icons')).icons,
      icons: Record<string, TemplateResult> = {};

    for (const iconName of Object.keys(paths)) {
      icons[iconName] = Icon({ name: iconName, paths: paths[iconName] });
    }

    return icons;
  }
}
