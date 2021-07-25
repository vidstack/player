import { html, LitElement } from 'lit';

import { watchContext } from '../../foundation/context/index.js';
import {
  controlsContext,
  ManagedControls,
  mediaContext
} from '../../media/index.js';
import { setAttribute } from '../../utils/dom.js';
import { controlsElementStyles } from './styles.js';

export const CONTROLS_ELEMENT_TAG_NAME = 'vds-controls';

/**
 * Container for holding individual media controls.
 *
 * 💡 The following attributes are updated for your styling needs:
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

  render() {
    return html`<slot></slot>`;
  }

  /**
   * @protected
   * @param {boolean} hidden
   */
  @watchContext(controlsContext.hidden)
  _handleControlsHiddenContextUpdate(hidden) {
    setAttribute(this, 'hidden', hidden);
  }

  /**
   * @protected
   * @param {boolean} idle
   */
  @watchContext(controlsContext.idle)
  _handleControlsIdleContextUpdate(idle) {
    setAttribute(this, 'idle', idle);
  }

  /**
   * @protected
   * @param {boolean} canPlay
   */
  @watchContext(mediaContext.canPlay)
  _handleCanPlayContextUpdate(canPlay) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  /**
   * @protected
   * @param {boolean} paused
   */
  @watchContext(mediaContext.paused)
  _handlePausedContextUpdate(paused) {
    setAttribute(this, 'media-paused', paused);
  }

  /**
   * @protected
   * @param {boolean} viewType
   */
  @watchContext(mediaContext.viewType)
  _handleViewTypeContextUpdate(viewType) {
    setAttribute(this, 'media-view-type', viewType);
  }
}
