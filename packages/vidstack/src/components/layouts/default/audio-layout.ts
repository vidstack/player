import { DefaultLayout } from './default-layout';
import type { DefaultLayoutProps } from './props';

/**
 * The audio layout is our production-ready UI that's displayed when the media view type is set to
 * 'audio'. It includes support for audio tracks, slider chapters, captions, live streams, and much
 * more out of the box.
 *
 * @attr data-match - Whether this layout is being used (query match).
 * @attr data-sm - The small layout is active
 * @attr data-lg - The large layout is active.
 * @attr data-size - The active layout size (sm or lg).
 */
export class DefaultAudioLayout extends DefaultLayout {
  static override props: DefaultLayoutProps = {
    ...super.props,
    when: ({ viewType }) => viewType === 'audio',
    smallWhen: ({ width }) => width < 576,
  };
}
