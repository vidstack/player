import { Component, effect, signal, type WriteSignal } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { watchCueTextChange, type MediaContext } from '../../core';
import { useMediaContext } from '../../core/api/media-context';

class ChapterTitle extends Component {}

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/display/chapter-title}
 * @example
 * ```html
 * <media-chapter-title></media-chapter-title>
 * ```
 */
export class MediaChapterTitleElement extends Host(HTMLElement, ChapterTitle) {
  static tagName = 'media-chapter-title';

  private _media!: MediaContext;
  private _chapterTitle!: WriteSignal<string>;

  protected onSetup() {
    this._media = useMediaContext();
    this._chapterTitle = signal('');
  }

  protected onConnect() {
    const tracks = this._media.textTracks;
    watchCueTextChange(tracks, 'chapters', this._chapterTitle.set);

    effect(() => {
      this.textContent = this._chapterTitle();
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-chapter-title': MediaChapterTitleElement;
  }
}
