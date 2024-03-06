import { html, type TemplateResult } from 'lit-html';
import { effect } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { useMediaState } from '../../../../../../core/api/media-context';

export function MenuPortal(container: HTMLElement | null, template: TemplateResult) {
  return html`
    <media-menu-portal .container=${container} disabled="fullscreen">
      ${template}
    </media-menu-portal>
  `;
}

export function createMenuContainer(className: string) {
  let container = document.querySelector<HTMLElement>(`body > .${className}`);

  if (!container) {
    container = document.createElement('div');
    container.style.display = 'contents';
    container.classList.add(className);
    document.body.append(container);
  }

  const { viewType } = useMediaState(),
    { colorScheme } = useDefaultLayoutContext();

  effect(() => {
    if (!container) return;
    setAttribute(container, 'data-view-type', viewType());
    container.classList.toggle('light', colorScheme() === 'light');
  });

  return container;
}
