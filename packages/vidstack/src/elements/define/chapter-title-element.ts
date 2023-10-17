import { Component, computed, effect, signal } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { listenEvent } from 'maverick.js/std';

import { observeActiveTextTrack, type MediaContext } from '../../core';
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
  private _chapterTitle = signal('');

  private _title = computed(() => {
    const { title, started } = this._media.$state;
    return started() ? this._chapterTitle() || title() : title();
  });

  protected onSetup() {
    this._media = useMediaContext();
  }

  protected onConnect() {
    observeActiveTextTrack(this._media.textTracks, 'chapters', (track) => {
      if (!track) {
        this._chapterTitle.set('');
        return;
      }

      const onCueChange = () => {
        const activeCue = track?.activeCues[0];
        this._chapterTitle.set(activeCue?.text || '');
      };

      onCueChange();
      listenEvent(track, 'cue-change', onCueChange);
    });

    effect(() => {
      this.textContent = this._title();
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-chapter-title': MediaChapterTitleElement;
  }
}
