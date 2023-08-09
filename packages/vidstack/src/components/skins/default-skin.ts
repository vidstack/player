import {
  Component,
  createContext,
  prop,
  provideContext,
  useContext,
  type ReadSignal,
} from 'maverick.js';
import { PlayerQueryList } from '../../core';

/**
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/skins#default-skin}
 */
export class DefaultSkin extends Component<DefaultSkinProps> {
  static props: DefaultSkinProps = {
    when: '',
    smWhen: '',
    thumbnails: '',
    translations: null,
  };

  private _whenQueryList!: PlayerQueryList;
  private _whenSmQueryList!: PlayerQueryList;

  @prop
  get isMatch() {
    return this._whenQueryList.matches;
  }

  @prop
  get isSmallMatch() {
    return this._whenSmQueryList.matches;
  }

  protected override onSetup(): void {
    const { when, smWhen, thumbnails, translations } = this.$props;

    this._whenQueryList = PlayerQueryList.create(when);
    this._whenSmQueryList = PlayerQueryList.create(smWhen);

    this.setAttributes({
      'data-match': this._whenQueryList.$matches,
      'data-sm': this._whenSmQueryList.$matches,
    });

    provideContext(defaultSkinContext, {
      smQueryList: this._whenSmQueryList,
      thumbnails,
      translations,
    });
  }
}

export class DefaultAudioUI extends DefaultSkin {
  static override props: DefaultSkinProps = {
    ...super.props,
    when: '(view-type: audio)',
    smWhen: '(width < 576)',
  };
}

export class DefaultVideoUI extends DefaultSkin {
  static override props: DefaultSkinProps = {
    ...super.props,
    when: '(view-type: video)',
    smWhen: '(width < 576) or (height < 380)',
  };
}

export interface DefaultSkinProps {
  /**
   * A player query string that determines when the UI should be displayed. The special string
   * 'never' will indicate that the UI should never be displayed.
   */
  when: string;
  /**
   * A player query string that determines when the small (e.g., mobile) UI should be displayed. The
   * special string 'never' will indicate that the small device optimized UI should never be
   * displayed.
   */
  smWhen: string;
  /**
   * The absolute or relative URL to a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
   * file resource.
   */
  thumbnails: string;
  /**
   * Translation map from english to your desired language for words used throughout the skin.
   */
  translations: DefaultSkinTranslations | null;
}

export interface DefaultSkinContext {
  smQueryList: PlayerQueryList;
  thumbnails: ReadSignal<string>;
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
