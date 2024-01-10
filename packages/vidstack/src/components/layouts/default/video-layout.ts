import { DefaultLayout } from './default-layout';
import type { DefaultLayoutProps } from './props';

/**
 * The video layout is our production-ready UI that's displayed when the media view type is set to
 * 'video'. It includes support for picture-in-picture, fullscreen, slider chapters, slider
 * previews, captions, and audio/quality settings out of the box. It doesn't support live
 * streams just yet.
 *
 * @attr data-match - Whether this layout is being used (query match).
 * @attr data-size - The active layout size.
 */
export class DefaultVideoLayout extends DefaultLayout {
  static override props: DefaultLayoutProps = {
    ...super.props,
    when: '(view-type: video)',
    smallWhen: '(width < 576) or (height < 380)',
  };
}
