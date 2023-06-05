import { computed, provideContext } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';

import { getUIComponents } from '../../../register';
import { useMedia, type MediaContext } from '../../core/api/context';
import { renderAudio } from './audio';
import { communitySkinContext, type CommunitySkinTranslations } from './context';
import { renderVideo } from './video';

declare global {
  interface MaverickElements {
    'media-community-skin': MediaCommunitySkinElement;
  }
}

/**
 * @docs {@link https://www.vidstack.io/docs/player/styling/skins#community-skin}
 * @example
 * ```html
 * <media-player>
 *   <media-outlet />
 *   <media-community-skin />
 * </media-player>
 * ```
 */
export class CommunitySkin extends Component<CommunitySkinAPI> {
  static el = defineElement<CommunitySkinAPI>({
    tagName: 'media-community-skin',
    nohydrate: true,
    props: {
      translations: null,
    },
  });

  static register = getUIComponents();

  protected _media: MediaContext;

  constructor(instance: ComponentInstance<CommunitySkinAPI>) {
    super(instance);
    this._media = useMedia();
    provideContext(communitySkinContext, {
      $props: this.$props,
      $media: this._media.$store,
    });
  }

  /** We need this to compute and save the layout type to prevent unnecessary re-renders. */
  protected _getLayoutType() {
    const { viewType, streamType } = this._media.$store;
    return viewType() === 'audio'
      ? streamType().includes('live')
        ? 'audio:live'
        : 'audio'
      : streamType().endsWith('live')
      ? 'video:live'
      : 'video';
  }

  protected override onAttach() {
    this.setAttributes({
      'data-audio': this._isAudio.bind(this),
      'data-video': this._isVideo.bind(this),
      'data-mobile': this._isMobile.bind(this),
    });
  }

  protected _isAudio() {
    const { viewType } = this._media.$store;
    return viewType() === 'audio';
  }

  protected _isVideo() {
    const { viewType } = this._media.$store;
    return viewType() !== 'audio';
  }

  protected _isMobile() {
    const { breakpointX } = this._media.$store;
    return breakpointX() === 'sm';
  }

  override render() {
    if (__SERVER__) return null;

    const $layoutType = computed(this._getLayoutType.bind(this));

    return () => {
      const render = $layoutType().startsWith('video') ? renderVideo : renderAudio;

      // TODO: When we add live stream designs.
      // const type = $layoutType(),
      //   render = type.startsWith('video')
      //     ? type === 'video:live'
      //       ? renderLiveVideo
      //       : renderVideo
      //     : type === 'audio:live'
      //     ? renderLiveAudio
      //     : renderAudio;

      return render();
    };
  }
}

export interface CommunitySkinAPI {
  props: CommunitySkinProps;
}

export interface CommunitySkinProps {
  /**
   * Translation map from english to your desired language for words used throughout the skin.
   */
  translations: CommunitySkinTranslations | null;
}

export interface MediaCommunitySkinElement extends HTMLCustomElement<CommunitySkin> {}
