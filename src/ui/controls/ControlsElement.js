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
  managedControls = new ManagedControls(this);

  /**
   * @protected
   * @readonly
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.canPlay)
  mediaCanPlay = false;

  /**
   * @type {boolean}
   */
  @state()
  @consumeContext(controlsContext.hidden)
  controlsHidden = false;

  /**
   * @protected
   * @readonly
   * @type {boolean}
   */
  @state()
  @consumeContext(controlsContext.idle)
  controlsIdle = false;

  /**
   * @protected
   * @readonly
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.paused)
  mediaPaused = true;

  /**
   * @protected
   * @readonly
   * @type {ViewType}
   */
  @state()
  @consumeContext(mediaContext.viewType)
  mediaViewType = mediaContext.viewType.initialValue;

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    super.update(changedProperties);

    if (changedProperties.has('mediaCanPlay')) {
      setAttribute(this, 'media-can-play', this.mediaCanPlay);
    }

    if (changedProperties.has('controlsHidden')) {
      setAttribute(this, 'hidden', this.controlsHidden);
    }

    if (changedProperties.has('controlsIdle')) {
      setAttribute(this, 'idle', this.controlsIdle);
    }

    if (changedProperties.has('mediaPaused')) {
      setAttribute(this, 'media-paused', this.mediaPaused);
    }

    if (changedProperties.has('mediaViewType')) {
      setAttribute(this, 'media-view-type', this.mediaViewType);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
