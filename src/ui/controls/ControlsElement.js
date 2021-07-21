import { html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';

import { consumeContext } from '../../foundation/context/index.js';
import {
  controlsContext,
  ManagedControls,
  mediaContext,
  ViewType
} from '../../media/index.js';
import { setAttribute } from '../../utils/dom.js';
import { controlsElementStyles } from './styles.js';

export const CONTROLS_ELEMENT_TAG_NAME = 'vds-controls';

/**
 * Container for holding individual media controls.
 *
 * 💡 The styling is left to you, it will only apply the following attributes:
 *
 * - `hidden`: Applied when the controls should be hidden and not available to the user.
 * - `idle`: Applied when there is no user activity for a given period, `hidden` should have greater priority.
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-paused`: Applied when media is paused.
 * - `media-view-type`: Applied with the media view type such as `audio` or `video`.
 *
 * @tagname vds-controls
 * @slot Used to pass in controls.
 * @example
 * ```html
 * <vds-controls>
 *   <vds-play-button></vds-play-button>
 *   <vds-scrubber></vds-scrubber>
 *   <vds-fullscreen-button></vds-fullscreen-button>
 * </vds-controls>
 * ```
 * @example
 * ```css
 * vds-controls {
 *   opacity: 1;
 *   transition: opacity 0.3s ease-out;
 * }
 *
 * vds-controls[hidden] {
 *   display: none;
 * }
 *
 * vds-controls[idle] {
 *   opacity: 0;
 * }
 * ```
 */
export class ControlsElement extends LitElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [controlsElementStyles];
  }

  /**
   * @protected
   * @readonly
   */
  _managedControls = new ManagedControls(this);

  /**
   * @protected
   * @readonly
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.canPlay)
  _mediaCanPlay = false;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(controlsContext.hidden)
  _controlsHidden = false;

  /**
   * @protected
   * @readonly
   * @type {boolean}
   */
  @state()
  @consumeContext(controlsContext.idle)
  _controlsIdle = false;

  /**
   * @protected
   * @readonly
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.paused)
  _mediaPaused = true;

  /**
   * @protected
   * @readonly
   * @type {ViewType}
   */
  @state()
  @consumeContext(mediaContext.viewType)
  _mediaViewType = mediaContext.viewType.initialValue;

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    super.update(changedProperties);

    if (changedProperties.has('_mediaCanPlay')) {
      setAttribute(this, 'media-can-play', this._mediaCanPlay);
    }

    if (changedProperties.has('_controlsHidden')) {
      setAttribute(this, 'hidden', this._controlsHidden);
    }

    if (changedProperties.has('_controlsIdle')) {
      setAttribute(this, 'idle', this._controlsIdle);
    }

    if (changedProperties.has('_mediaPaused')) {
      setAttribute(this, 'media-paused', this._mediaPaused);
    }

    if (changedProperties.has('_mediaViewType')) {
      setAttribute(this, 'media-view-type', this._mediaViewType);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
