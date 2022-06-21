import { withMedia } from '../shared/with-media';
import { default as Media$1 } from './_components/Media';

export * from '../shared/use-media';
export * from './_components';
export type { VdsElementEventCallbackMap, VdsReactComponentProps } from './lib';

/**
 * All media elements exist inside the `<vds-media>` component. It's main jobs are to host the
 * media controller, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 */
export const Media = /* @__PURE__ */ withMedia(Media$1) as typeof Media$1;
