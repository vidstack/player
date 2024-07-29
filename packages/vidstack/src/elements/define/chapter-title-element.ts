import { Component, effect, signal, type WriteSignal } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';
import { watchCueTextChange } from '../../core/tracks/text/utils';

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

  #media!: MediaContext;
  #chapterTitle!: WriteSignal<string>;

  protected onSetup() {
    this.#media = useMediaContext();
    this.#chapterTitle = signal('');
  }

  protected onConnect() {
    const tracks = this.#media.textTracks;
    watchCueTextChange(tracks, 'chapters', this.#chapterTitle.set);
    effect(this.#watchChapterTitle.bind(this));
  }

  #watchChapterTitle() {
    const { defaultText } = this.$props;
    this.textContent = this.#chapterTitle() || defaultText();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-chapter-title': MediaChapterTitleElement;
  }
}
