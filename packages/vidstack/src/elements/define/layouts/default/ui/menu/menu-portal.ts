import { html, type TemplateResult } from 'lit-html';
import { effect, type ReadSignal } from 'maverick.js';
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

export function createMenuContainer(className: string, isSmallLayout: ReadSignal<boolean>) {
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

    const isSmall = isSmallLayout();

    setAttribute(container, 'data-view-type', viewType());
    setAttribute(container, 'data-sm', isSmall);
    setAttribute(container, 'data-lg', !isSmall);
    setAttribute(container, 'data-size', isSmall ? 'sm' : 'lg');

    container.classList.toggle('light', colorScheme() === 'light');
  });

  return container;
}
