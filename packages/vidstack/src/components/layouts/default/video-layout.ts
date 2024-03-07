import { DefaultLayout } from './default-layout';
import type { DefaultLayoutProps } from './props';

/**
 * The video layout is our production-ready UI that's displayed when the media view type is set to
 * 'video'. It includes support for picture-in-picture, fullscreen, slider chapters, slider
 * previews, captions, audio/quality settings, live streams, and much more out of the box.
 *
 * @attr data-match - Whether this layout is being used (query match).
 * @attr data-sm - The small layout is active
 * @attr data-lg - The large layout is active.
 * @attr data-size - The active layout size.
 */
export class DefaultVideoLayout extends DefaultLayout {
  static override props: DefaultLayoutProps = {
    ...super.props,
    when: ({ viewType }) => viewType === 'video',
    smallWhen: ({ width, height }) => width < 576 || height < 380,
  };
}
