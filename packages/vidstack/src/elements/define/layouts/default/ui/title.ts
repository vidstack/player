import { html } from 'lit-html';
import { signal } from 'maverick.js';

import { useMediaContext, useMediaState } from '../../../../../core/api/media-context';
import type { TextTrack } from '../../../../../core/tracks/text/text-track';
import { watchActiveTextTrack } from '../../../../../core/tracks/text/utils';
import { $signal } from '../../../../lit/directives/signal';

export function DefaultTitle() {
  return $signal(() => {
    const { textTracks } = useMediaContext(),
      { title, started } = useMediaState(),
      $hasChapters = signal<TextTrack | null>(null);

    watchActiveTextTrack(textTracks, 'chapters', $hasChapters.set);

    return $hasChapters() && (started() || !title())
      ? DefaultChapterTitle()
      : html`<media-title class="vds-chapter-title"></media-title>`;
  });
}

export function DefaultChapterTitle() {
  return html`<media-chapter-title class="vds-chapter-title"></media-chapter-title>`;
}
