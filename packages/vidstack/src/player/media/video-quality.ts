import {
  List,
  ListAddEvent,
  ListChangeEvent,
  ListEvents,
  ListItem,
  ListRemoveEvent,
} from '../../foundation/list/list';

/**
 * @see {@link https://vidstack.io/docs/player/core-concepts/quality#quality-list}
 */
export class VideoQualityList extends List<VideoQuality> {
  /**
   * Configures quality switching:
   *
   * - `current`: Trigger an immediate quality level switch. This will abort the current fragment
   * request if any, flush the whole buffer, and fetch fragment matching with current position
   * and requested quality level.
   *
   * - `next`: Trigger a quality level switch for next fragment. This could eventually flush
   * already buffered next fragment.
   *
   * - `load`: Set quality level for next loaded fragment.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/quality#switch}
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#quality-switch-control-api}
   */
  switch: 'current' | 'next' | 'load' = 'current';
}

export interface VideoQuality extends ListItem {
  readonly width: number;
  readonly height: number;
  readonly bitrate: number;
  readonly codec: string;
}

export interface VideoQualityListEvents extends ListEvents<VideoQuality> {
  add: AddVideoQualityEvent;
  remove: RemoveVideoQualityEvent;
  change: ChangeVideoQualityEvent;
}

export interface AddVideoQualityEvent extends ListAddEvent<VideoQuality> {}
export interface RemoveVideoQualityEvent extends ListRemoveEvent<VideoQuality> {}
export interface ChangeVideoQualityEvent extends ListChangeEvent<VideoQuality> {}
