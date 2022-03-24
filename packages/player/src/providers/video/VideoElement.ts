import { vdsEvent } from '@vidstack/foundation';
import { css, CSSResultGroup } from 'lit';

import { ViewType } from '../../media';
import { Html5MediaElement } from '../html5';
import { VideoFullscreenController } from './fullscreen';
import { VideoPresentationController } from './presentation';

/**
 * @tagname vds-video
 * @slot - Used to pass in `<video>` element.
 * @events ./presentation/events.ts
 * @example
 * ```html
 * <vds-video>
 *   <video
 *     src="https://media-files.vidstack.io/720p.mp4"
 *     poster="https://media-files.vidstack.io/poster.png"
 *   ></video>
 * </vds-video>
 * ```
 * @example
 * ```html
 * <vds-video loading="lazy">
 *   <video
 *     src="https://media-files.vidstack.io/720p.mp4"
 *     preload="none"
 *     data-preload="metadata"
 *     data-poster="https://media-files.vidstack.io/poster.png"
 *   ></video>
 * </vds-video>
 * ```
 * @example
 * ```html
 * <vds-video>
 *   <video poster="https://media-files.vidstack.io/poster.png">
 *     <source src="https://media-files.vidstack.io/720p.mp4" type="video/mp4" />
 *     <track
 *       default
 *       kind="subtitles"
 *       srclang="en"
 *       label="English"
 *       src="https://media-files.vidstack.io/subs/english.vtt"
 *     />
 *   </video>
 * </vds-video>
 * ```
 */
export class VideoElement extends Html5MediaElement {
  static override get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: inline-block;
          background-color: #000;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(
      vdsEvent('vds-view-type-change', {
        detail: ViewType.Video,
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  get videoElement() {
    return this.mediaElement as HTMLVideoElement;
  }

  readonly presentationController = new VideoPresentationController(this);

  override readonly fullscreenController = new VideoFullscreenController(
    this,
    this.screenOrientationController,
    this.presentationController,
  );
}
