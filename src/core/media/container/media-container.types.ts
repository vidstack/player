import { MediaUiElement } from '../ui';

export const MEDIA_CONTAINER_ELEMENT_TAG_NAME = 'media-container';

export interface MediaContainerElementProps {
  /**
   * The aspect ratio of the container expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the media is not in fullscreen mode. Defaults to `undefined`.
   */
  aspectRatio: string | undefined;

  /**
   * The media container element.
   *
   * @default HTMLDivElement
   */
  readonly mediaContainerElement: HTMLDivElement;

  /**
   * The media UI component.
   *
   * @default MediaUiElement
   */
  readonly mediaUiElement: MediaUiElement;

  /**
   * The component's root element.
   *
   * @default HTMLDivElement
   */
  readonly rootElement: HTMLDivElement;
}
