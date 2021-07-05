import { html } from 'lit';

import { VdsElement } from '../../../foundation/elements/index.js';
import {
  controlsContext,
  ManagedControls,
  mediaContext,
  ViewType
} from '../../../media/index.js';
import { setAttribute } from '../../../utils/dom.js';
import { controlsElementStyles } from './styles.js';

export const CONTROLS_ELEMENT_TAG_NAME = 'vds-controls';

/**
 * Container for holding individual media controls.
 *
 * ⚠️ **IMPORTANT:** The styling is left to you, it will only apply the following attributes:
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
export class ControlsElement extends VdsElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [controlsElementStyles];
  }

  /**
   * @type {import('../../../foundation/context/types').ContextConsumerDeclarations}
   */
  static get contextConsumers() {
    return {
      canPlay: mediaContext.canPlay,
      hidden: controlsContext.hidden,
      idle: controlsContext.idle,
      paused: mediaContext.paused,
      viewType: mediaContext.viewType
    };
  }

  /**
   * @readonly
   */
  managedControls = new ManagedControls(this);

  constructor() {
    super();

    // Context Properties
    /**
     * @protected
     * @readonly
     * @type {boolean}
     */
    this.canPlay = mediaContext.canPlay.initialValue;
    /**
     * @type {boolean}
     */
    this.hidden = controlsContext.hidden.initialValue;
    /**
     * @protected
     * @readonly
     * @type {boolean}
     */
    this.idle = controlsContext.idle.initialValue;
    /**
     * @protected
     * @readonly
     * @type {boolean}
     */
    this.paused = mediaContext.paused.initialValue;
    /**
     * @protected
     * @readonly
     * @type {ViewType}
     */
    this.viewType = mediaContext.viewType.initialValue;
  }

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    super.update(changedProperties);

    if (changedProperties.has('canPlay')) {
      setAttribute(this, 'media-can-play', this.canPlay);
    }

    if (changedProperties.has('hidden')) {
      setAttribute(this, 'hidden', this.hidden);
    }

    if (changedProperties.has('idle')) {
      setAttribute(this, 'idle', this.idle);
    }

    if (changedProperties.has('paused')) {
      setAttribute(this, 'media-paused', this.paused);
    }

    if (changedProperties.has('viewType')) {
      setAttribute(this, 'media-view-type', this.viewType);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
