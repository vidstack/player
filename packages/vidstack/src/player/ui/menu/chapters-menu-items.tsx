import { effect, peek, signal } from 'maverick.js';
import { ComponentInstance, defineElement, type HTMLCustomElement } from 'maverick.js/element';
import { isNumber, listenEvent } from 'maverick.js/std';

import { ClassManager } from '../../../foundation/observers/class-manager';
import { formatSpokenTime, formatTime } from '../../../utils/time';
import { useMedia, type MediaContext } from '../../core/api/context';
import type { TextTrack } from '../../core/tracks/text/text-track';
import { isCueActive, onTrackChapterChange } from '../../core/tracks/text/utils';
import { Thumbnail } from '../thumbnail';
import { MenuItems, type MenuItemsAPI } from './menu-items';
import { Radio } from './radio/radio';
import { RadioGroup, type RadioGroupChangeEvent } from './radio/radio-group';
import { renderRadioGroup } from './radio/render';

declare global {
  interface MaverickElements {
    'media-chapters-menu-items': MediaChaptersMenuItemsElement;
  }
}

/**
 * This component displays media chapters inside of a menu.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/chapters-menu}
 * @example
 * ```html
 * <media-menu>
 *   <media-menu-button aria-label="Chapters">
 *     <media-icon type="chapters"></media-icon>
 *   </media-menu-button>
 *   <media-chapters-menu-items></media-chapters-menu-items>
 * </media-menu>
 * ```
 */
export class ChaptersMenuItems extends MenuItems<ChaptersMenuItemsAPI> {
  static override el = defineElement<ChaptersMenuItemsAPI>({
    tagName: 'media-chapters-menu-items',
    props: {
      containerClass: null,
      chapterClass: null,
      thumbnailClass: null,
      contentClass: null,
      titleClass: null,
      startTimeClass: null,
      durationClass: null,
    },
  });

  static register = [Thumbnail, RadioGroup, Radio];

  protected _media: MediaContext;
  protected _index = signal(0);
  protected _track = signal<TextTrack | null>(null);

  constructor(instance: ComponentInstance<ChaptersMenuItemsAPI>) {
    super(instance);
    this._media = useMedia();
  }

  protected override onAttach(el) {
    super.onAttach(el);
    this.setAttributes({
      'data-thumbnails': this._hasThumbnails.bind(this),
    });
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchCurrentTime.bind(this));
    effect(this._watchControllerDisabled.bind(this));

    this._onTrackModeChange();
    listenEvent(this._media.textTracks, 'mode-change', this._onTrackModeChange.bind(this));

    const {
      chapterClass,
      thumbnailClass,
      contentClass,
      titleClass,
      startTimeClass,
      durationClass,
    } = this.$props;
    new ClassManager(el)
      ._observe('[part="chapter"]', chapterClass)
      ._observe('[part="thumbnail"]', thumbnailClass)
      ._observe('[part="content"]', contentClass)
      ._observe('[part="title"]', titleClass)
      ._observe('[part="start-time"]', startTimeClass)
      ._observe('[part="duration"]', durationClass);
  }

  protected _hasThumbnails() {
    const { thumbnailCues } = this._media.$store;
    return thumbnailCues().length > 0;
  }

  protected _watchCurrentTime() {
    if (!this._menu._expanded()) return;

    const track = this._track(),
      { currentTime } = this._media.$store;

    if (!track) {
      this._index.set(-1);
      return;
    }

    const time = currentTime();
    this._index.set(track.cues.findIndex((cue) => isCueActive(cue, time)));
  }

  protected _watchControllerDisabled() {
    this._menu._disable(this._isDisabled());
  }

  protected _isDisabled() {
    const track = this._track();
    return !track || !track.cues.length;
  }

  protected _onChange(event: RadioGroupChangeEvent) {
    if (this._isDisabled() || !event.trigger) return;

    const index = +event.target.value,
      cues = this._track()?.cues;

    if (isNumber(index) && cues?.[index]) {
      this._index.set(index);
      this._media.remote.seek(cues[index].startTime, event);
    }
  }

  protected _onTrackModeChange() {
    onTrackChapterChange(this._media.textTracks, peek(this._track), this._track.set);
  }

  protected _getValue() {
    return this._index() + '';
  }

  protected _getOptions() {
    const track = this._track();
    if (!track) return [];
    return track.cues.map((cue, i) => ({
      value: i + '',
      content: (
        <>
          {this._hasThumbnails() && <media-thumbnail part="thumbnail" $prop:time={cue.startTime} />}
          <div part="content">
            <div part="title">{cue.text}</div>
            <div part="start-time">{formatTime(cue.startTime)}</div>
            <div part="duration">{formatSpokenTime(cue.endTime - cue.startTime)}</div>
          </div>
        </>
      ),
    }));
  }

  override render() {
    const { containerClass } = this.$props;
    return renderRadioGroup({
      part: 'chapter',
      value: this._getValue.bind(this),
      options: this._getOptions.bind(this),
      radioGroupClass: containerClass,
      onChange: this._onChange.bind(this),
    });
  }
}

export interface ChaptersMenuItemsAPI extends MenuItemsAPI {
  props: ChapterMenuItemsProps;
}

export interface ChapterMenuItemsProps {
  containerClass: string | null;
  chapterClass: string | null;
  thumbnailClass: string | null;
  contentClass: string | null;
  titleClass: string | null;
  startTimeClass: string | null;
  durationClass: string | null;
}

export interface MediaChaptersMenuItemsElement extends HTMLCustomElement<ChaptersMenuItems> {}
