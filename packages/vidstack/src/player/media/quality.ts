import {
  List,
  ListAddEvent,
  ListChangeEvent,
  ListEvents,
  ListItem,
  ListRemoveEvent,
} from '../../foundation/list/list';

export class VideoQualityList extends List<VideoQuality> {}

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
