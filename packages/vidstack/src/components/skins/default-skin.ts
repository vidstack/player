import {
  Component,
  computed,
  createContext,
  method,
  provideContext,
  useContext,
  type ReadSignal,
} from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../core/api/media-context';

/**
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/skins#default-skin}
 */
export class DefaultSkin extends Component<DefaultSkinProps> {
  static props = {
    translations: null,
  };

  protected _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();

    this.setAttributes({
      'data-audio': this.isAudio.bind(this),
      'data-video': this.isVideo.bind(this),
      'data-mobile': this.isMobile.bind(this),
    });

    provideContext(defaultSkinContext, {
      translations: this.$props.translations,
    });
  }

  @method
  getLayoutType() {
    const { viewType, streamType } = this._media.$state;
    return viewType() === 'audio'
      ? streamType().includes('live')
        ? 'audio:live'
        : 'audio'
      : streamType().endsWith('live')
      ? 'video:live'
      : 'video';
  }

  @method
  isAudio() {
    const { viewType } = this._media.$state;
    return viewType() === 'audio';
  }

  @method
  isVideo() {
    const { viewType } = this._media.$state;
    return viewType() !== 'audio';
  }

  private $isMobile = computed(() => {
    const { breakpointX } = this._media.$state;
    return breakpointX() === 'sm';
  });

  @method
  isMobile() {
    return this.$isMobile();
  }
}

export interface DefaultSkinProps {
  /**
   * Translation map from english to your desired language for words used throughout the skin.
   */
  translations: DefaultSkinTranslations | null;
}

export interface DefaultSkinContext {
  translations: ReadSignal<DefaultSkinTranslations | null>;
}

export interface DefaultSkinTranslations {
  Audio: string;
  Auto: string;
  Captions: string;
  Chapters: string;
  Default: string;
  Mute: string;
  Normal: string;
  Off: string;
  Pause: string;
  Play: string;
  Speed: string;
  Quality: string;
  Settings: string;
  Unmute: string;
  'Seek Forward': string;
  'Seek Backward': string;
  'Closed-Captions On': string;
  'Closed-Captions Off': string;
  'Enter Fullscreen': string;
  'Exit Fullscreen': string;
  'Enter PiP': string;
  'Exit PiP': string;
}

export function i18n(
  translations: ReadSignal<DefaultSkinTranslations | null>,
  key: keyof DefaultSkinTranslations,
) {
  return translations()?.[key] ?? key;
}

export const defaultSkinContext = createContext<DefaultSkinContext>();

export function useDefaultSkinContext() {
  return useContext(defaultSkinContext);
}
