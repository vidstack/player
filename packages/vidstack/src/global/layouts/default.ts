import type { DefaultLayoutProps } from '../../components/layouts/default/props';
import type { VidstackPlayerLayoutLoader } from './loader';

export class VidstackPlayerLayout implements VidstackPlayerLayoutLoader {
  constructor(readonly props?: Partial<DefaultLayoutProps>) {}

  readonly name = 'vidstack';

  async load() {
    await import('../../elements/bundles/player-layouts/default');
    await import('../../elements/bundles/player-ui');
  }

  create() {
    const layouts = [
      document.createElement('media-audio-layout'),
      document.createElement('media-video-layout'),
    ];

    if (this.props) {
      for (const [prop, value] of Object.entries(this.props)) {
        for (const el of layouts) el[prop] = value;
      }
    }

    return layouts;
  }
}
