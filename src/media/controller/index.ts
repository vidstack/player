import type { VideoElement } from '../../providers/video';
import { MediaProviderElement } from '../provider/MediaProviderElement.js';
import type { ForwardedMediaProviderProps } from './forward';

export * from './forward.js';
export * from './MediaControllerElement.js';
export * from './styles.js';

type MediaControllerProviderExtension = Pick<
  VideoElement,
  ForwardedMediaProviderProps
>;

declare module './MediaControllerElement.js' {
  export interface MediaControllerElement<
    MediaProvider extends MediaProviderElement = MediaProviderElement
  > extends MediaControllerProviderExtension {}
}
