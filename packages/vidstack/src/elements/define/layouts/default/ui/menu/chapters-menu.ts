import { html } from 'lit-html';
import { computed, signal, type ReadSignal } from 'maverick.js';
import { isFunction, unwrap } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import type { MenuPlacement } from '../../../../../../components/ui/menu/menu-items';
import type { TooltipPlacement } from '../../../../../../components/ui/tooltip/tooltip-content';
import { useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { IconSlot } from '../../slots';
import { $i18n } from '../utils';
import { MenuPortal } from './menu-portal';

export function DefaultChaptersMenu({
  placement,
  tooltip,
  portal,
}: {
  portal?: boolean;
  placement: MenuPlacement | ReadSignal<MenuPlacement | null>;
  tooltip: TooltipPlacement | ReadSignal<TooltipPlacement>;
}) {
  const { viewType } = useMediaState(),
    {
      translations,
      thumbnails,
      menuContainer,
      noModal,
      menuGroup,
      smallWhen: smWhen,
    } = useDefaultLayoutContext(),
    $placement = computed(() =>
      noModal() ? unwrap(placement) : !smWhen() ? unwrap(placement) : null,
    ),
    $offset = computed(() =>
      !smWhen() && menuGroup() === 'bottom' && viewType() === 'video' ? 26 : 0,
    ),
    $isOpen = signal(false);

  function onOpen() {
    $isOpen.set(true);
  }

  function onClose() {
    $isOpen.set(false);
  }

  const items = html`
    <media-menu-items
      class="vds-chapters-menu-items vds-menu-items"
      placement=${$signal($placement)}
      offset=${$signal($offset)}
    >
      ${$signal(() => {
        if (!$isOpen()) return null;
        return html`
          <media-chapters-radio-group
            class="vds-chapters-radio-group vds-radio-group"
            .thumbnails=${$signal(thumbnails)}
          >
            <template>
              <media-radio class="vds-chapter-radio vds-radio">
                <media-thumbnail class="vds-thumbnail"></media-thumbnail>
                <div class="vds-chapter-radio-content">
                  <span class="vds-chapter-radio-label" data-part="label"></span>
                  <span class="vds-chapter-radio-start-time" data-part="start-time"></span>
                  <span class="vds-chapter-radio-duration" data-part="duration"></span>
                </div>
              </media-radio>
            </template>
          </media-chapters-radio-group>
        `;
      })}
    </media-menu-items>
  `;

  return html`
    <media-menu class="vds-chapters-menu vds-menu" @open=${onOpen} @close=${onClose}>
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button
            class="vds-menu-button vds-button"
            aria-label=${$i18n(translations, 'Chapters')}
          >
            ${IconSlot('menu-chapters')}
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content
          class="vds-tooltip-content"
          placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
        >
          ${$i18n(translations, 'Chapters')}
        </media-tooltip-content>
      </media-tooltip>
      ${portal ? MenuPortal(menuContainer, items) : items}
    </media-menu>
  `;
}
