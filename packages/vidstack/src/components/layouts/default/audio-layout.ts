import { DefaultLayout } from './default-layout';
import type { DefaultLayoutProps } from './props';

/**
 * The audio layout is our production-ready UI that's displayed when the media view type is set to
 * 'audio'. It includes support for audio tracks, slider chapters, and captions out of the box. It
 * doesn't support live streams just yet.
 *
 * @attr data-match - Whether this layout is being used (query match).
 * @attr data-size - The active layout size.
 */
export class DefaultAudioLayout extends DefaultLayout {
  static override props: DefaultLayoutProps = {
    ...super.props,
    when: '(view-type: audio)',
    smallWhen: '(width < 576)',
  };
}
