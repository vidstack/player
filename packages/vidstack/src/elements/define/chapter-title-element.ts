import { Component, effect, signal, type WriteSignal } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { watchCueTextChange, type MediaContext } from '../../core';
import { useMediaContext } from '../../core/api/media-context';

interface ChapterTitleProps {
  /**
   * Specify text to be displayed when no chapter title is available.
   */
  defaultText: string;
}

class ChapterTitle extends Component<ChapterTitleProps> {
  static props: ChapterTitleProps = {
    defaultText: '',
  };
}

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
    effect(this._watchChapterTitle.bind(this));
  }

  private _watchChapterTitle() {
    const { defaultText } = this.$props;
    this.textContent = this._chapterTitle() || defaultText();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-chapter-title': MediaChapterTitleElement;
  }
}
