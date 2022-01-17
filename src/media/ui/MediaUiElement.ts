import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult
} from 'lit';
import { state } from 'lit/decorators.js';

import { setAttribute } from '../../utils/dom';
import { IS_IOS } from '../../utils/support';
import { hostedMediaStoreSubscription } from '../mediaStore';
import { ViewType } from '../ViewType';
import { mediaUiElementStyles } from './styles';

/**
 * This is a general container to hold your UI components, and enables you to show/hide
 * the player UI when media is ready for playback by applying the `media-can-play` attribute.
 *
 * This element also handles hiding the UI depending on whether native UI can't be hidden
 * (*cough* iOS). This is simply to avoid double controls (native + custom). The `hidden` attribute
 * will be applied to prevent it from happenning.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-idle`: Applied when there is no user activity for a set period of time.
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-paused`: Applied when media is paused.
 * - `media-view-type`: Applied with the media view type such as `audio` or `video`.
 * - `media-autoplay-error`: Applied when media autoplay fails. It can be used to show recovery UI
 * if controls are hidden.
 * - `media-fullscreen`: Applied when media has entered fullscreen mode.
 * - `media-playsinline`: Applied when media is to be played "inline", that is within the element's
 * playback area
 *
 * @tagname vds-media-ui
 * @slot Used to pass in UI components.
 * @example
 * ```html
 * <vds-media-ui>
 *   <!-- ... -->
 * </vds-media-ui>
 * ```
 * @example
 * ```css
 * vds-media-ui {
 *   opacity: 1;
 *   transition: opacity 0.15s ease-out;
 * }
 *
 * vds-media-ui[idle],
 * vds-media-ui:not([media-can-play]) {
 *   opacity: 0;
 * }
 * ```
 */
export class MediaUiElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [mediaUiElementStyles];
  }

  static get parts(): string[] {
    return [];
  }

  @state() protected _mediaFullscreen = false;
  @state() protected _mediaIsVideoView = false;
  @state() protected _mediaPlaysinline = false;

  constructor() {
    super();
    hostedMediaStoreSubscription(this, 'canPlay', ($canPlay) => {
      setAttribute(this, 'media-can-play', $canPlay);
    });
    hostedMediaStoreSubscription(this, 'fullscreen', ($fullscreen) => {
      this._mediaFullscreen = $fullscreen;
      setAttribute(this, 'media-fullscreen', $fullscreen);
    });
    hostedMediaStoreSubscription(this, 'viewType', ($viewType) => {
      this._mediaIsVideoView = $viewType === ViewType.Video;
      setAttribute(this, 'media-view-type', $viewType);
    });
    hostedMediaStoreSubscription(this, 'idle', ($idle) => {
      setAttribute(this, 'media-idle', $idle);
    });
    hostedMediaStoreSubscription(this, 'paused', ($paused) => {
      setAttribute(this, 'media-paused', $paused);
    });
    hostedMediaStoreSubscription(this, 'playsinline', ($playsinline) => {
      this._mediaPlaysinline = $playsinline;
      setAttribute(this, 'media-playsinline', $playsinline);
    });
    hostedMediaStoreSubscription(this, 'autoplayError', ($autoplayError) => {
      setAttribute(this, 'media-autoplay-error', !!$autoplayError);
    });
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override update(changedProperties: PropertyValues) {
    setAttribute(this, 'hidden', this._isUiHidden());
    super.update(changedProperties);
  }

  protected override render(): TemplateResult {
    return this._renderDefaultSlot();
  }

  protected _renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected _isUiHidden(): boolean {
    return (
      IS_IOS &&
      this._mediaIsVideoView &&
      (!this._mediaPlaysinline || this._mediaFullscreen)
    );
  }
}
