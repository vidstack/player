import { html } from 'lit-html';

import { useMediaState } from '../../../../../core/api/media-context';
import { $signal } from '../../../../lit/directives/signal';
import { DefaultLiveButton } from './buttons';

export function DefaultTimeGroup() {
  return html`
    <div class="vds-time-group">
      ${$signal(() => {
        const { duration } = useMediaState();

        if (!duration()) return null;

        return [
          html`<media-time class="vds-time" type="current"></media-time>`,
          html`<div class="vds-time-divider">/</div>`,
          html`<media-time class="vds-time" type="duration"></media-time>`,
        ];
      })}
    </div>
  `;
}

export function DefaultTimeInvert() {
  return $signal(() => {
    const { live, duration } = useMediaState();
    return live()
      ? DefaultLiveButton()
      : duration()
        ? html`<media-time class="vds-time" type="current" toggle remainder></media-time>`
        : null;
  });
}

export function DefaultTimeInfo(): any {
  return $signal(() => {
    const { live } = useMediaState();
    return live() ? DefaultLiveButton() : DefaultTimeGroup();
  });
}
