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
import { mediaStoreSubscription } from '../mediaStore';
import { bindMediaPropsToAttrs, bindMediaPropsToCssProps } from '../style';
import { ViewType } from '../ViewType';
import { mediaUiElementStyles } from './styles';

/**
 * This is a general styling container which holds your UI elements. Media attributes and
 * CSS properties are exposed on this element to help you style your UI elements.
 *
 * Example media attributes include: `media-paused`, `media-can-play`, and `media-waiting`.
 *
 * Example media CSS properties include: `--media-seekable-amount`, `--media-buffered-amount`,
 * and `--media-duration`.
 *
 * This element also handles hiding the UI depending on whether native UI can't be hidden
 * (*cough* iOS). This is simply to avoid double controls (native + custom). The `hidden` attribute
 * will be applied to prevent it from happening.
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
 * vds-media-ui[media-idle],
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

    mediaStoreSubscription(this, 'fullscreen', ($fullscreen) => {
      this._mediaFullscreen = $fullscreen;
    });
    mediaStoreSubscription(this, 'viewType', ($viewType) => {
      this._mediaIsVideoView = $viewType === ViewType.Video;
    });
    mediaStoreSubscription(this, 'playsinline', ($playsinline) => {
      this._mediaPlaysinline = $playsinline;
    });

    bindMediaPropsToAttrs(this, [
      'autoplay',
      'autoplayError',
      'canLoad',
      'canPlay',
      'ended',
      'error',
      'fullscreen',
      'idle',
      'loop',
      'mediaType',
      'muted',
      'paused',
      'playing',
      'playsinline',
      'seeking',
      'started',
      'viewType',
      'waiting'
    ]);

    bindMediaPropsToCssProps(this, [
      'bufferedAmount',
      'currentTime',
      'duration',
      'seekableAmount'
    ]);
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
