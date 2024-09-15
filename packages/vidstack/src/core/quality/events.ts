import type { DOMEvent } from 'maverick.js/std';

import type { ListReadonlyChangeEvent } from '../../foundation/list/list';
import type { VideoQuality, VideoQualityList } from './video-quality';

export interface VideoQualityListEvents {
  add: VideoQualityAddEvent;
  remove: VideoQualityRemoveEvent;
  change: VideoQualityChangeEvent;
  'auto-change': VideoQualityAutoChangeEvent;
  'readonly-change': ListReadonlyChangeEvent;
}

export interface VideoQualityListEvent<T> extends DOMEvent<T> {
  target: VideoQualityList;
}

/**
 * Fired when a video quality has been added to the list.
 *
 * @detail newQuality
 */
export interface VideoQualityAddEvent extends VideoQualityListEvent<VideoQuality> {}

/**
 * Fired when a video quality has been removed from the list.
 *
 * @detail removedQuality
 */
export interface VideoQualityRemoveEvent extends VideoQualityListEvent<VideoQuality> {}

/**
 * Fired when the selected video quality has changed.
 *
 * @detail change
 */
export interface VideoQualityChangeEvent
  extends VideoQualityListEvent<VideoQualityChangeEventDetail> {}

export interface VideoQualityChangeEventDetail {
  prev: VideoQuality | null;
  current: VideoQuality;
}

/**
 * Fired when auto quality selection is enabled or disabled.
 */
export interface VideoQualityAutoChangeEvent extends VideoQualityListEvent<boolean> {}
