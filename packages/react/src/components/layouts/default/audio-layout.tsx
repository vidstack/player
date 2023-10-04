import * as React from 'react';

import { DefaultAudioLayoutLarge } from './audio-layout-large';
import { DefaultAudioLayoutSmall } from './audio-layout-small';
import { createDefaultMediaLayout, type DefaultMediaLayoutProps } from './shared-layout';

/* -------------------------------------------------------------------------------------------------
 * DefaultAudioLayout
 * -----------------------------------------------------------------------------------------------*/

const MediaLayout = createDefaultMediaLayout({
  type: 'audio',
  smLayoutWhen: '(width < 576)',
  SmallLayout: DefaultAudioLayoutSmall,
  LargeLayout: DefaultAudioLayoutLarge,
});

export interface DefaultAudioLayoutProps extends DefaultMediaLayoutProps {}

/**
 * The audio layout is our production-ready UI that's displayed when the media view type is set to
 * 'audio'. It includes support for audio tracks, slider chapters, and captions out of the box. It
 * doesn't support live streams just yet.
 *
 * @attr data-match - Whether this layout is being used (query match).
 * @attr data-size - The active layout size.
 * @example
 * ```tsx
 * <MediaPlayer src="audio.mp3">
 *   <MediaProvider />
 *   <DefaultAudioLayout icons={defaultLayoutIcons} />
 * </MediaPlayer>
 * ```
 */
function DefaultAudioLayout(props: DefaultAudioLayoutProps) {
  return <MediaLayout {...props} />;
}

DefaultAudioLayout.displayName = 'DefaultAudioLayout';
export { DefaultAudioLayout };
