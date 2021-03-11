import { PROVIDER_STORYBOOK_ARG_TYPES } from '../../core';
import { MediaCrossOriginOption, MediaPreloadOption } from './file.types';

export interface FileProviderProps {
  /**
   * The URL of a media resource to use.
   */
  src: string;

  /**
   * The width of the media player.
   */
  width?: number;

  /**
   * The height of the media player.
   */
  height?: number;

  /**
   * Whether to use CORS to fetch the related image. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) for more
   * information.
   */
  crossOrigin?: MediaCrossOriginOption;

  /**
   * Provides a hint to the browser about what the author thinks will lead to the best user
   * experience with regards to what content is loaded before the video is played. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload) for more
   * information.
   */
  preload?: MediaPreloadOption;
}

export type FileProviderStorybookArgs = {
  [P in keyof FileProviderProps]: unknown;
};

export const FILE_PROVIDER_STORYBOOK_ARG_TYPES = {
  ...PROVIDER_STORYBOOK_ARG_TYPES,
  src: {
    control: 'text',
    defaultValue: 'https://media.vidstack.io/720p.mp4',
  },
  width: {
    control: 'number',
  },
  height: {
    control: 'number',
  },
  crossOrigin: {
    control: {
      type: 'select',
      options: ['anonymous', 'use-credentials'],
    },
    defaultValue: 'anonymous',
  },
  preload: {
    control: {
      type: 'select',
      options: ['none', 'metadata', 'auto'],
    },
    defaultValue: 'metadata',
  },
};
