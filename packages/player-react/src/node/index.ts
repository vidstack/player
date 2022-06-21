import { withMedia } from '../shared/with-media';
import { default as Media$1 } from './_components/Media';

export * from '../shared/use-media';
export * from './_components';

export const Media = /* @__PURE__ */ withMedia(Media$1) as typeof Media$1;
