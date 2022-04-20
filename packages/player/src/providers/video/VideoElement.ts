import { vdsEvent } from '@vidstack/foundation';
import { css, CSSResultGroup } from 'lit';

import { ViewType } from '../../media';
import { Html5MediaElement } from '../html5';
import { VideoFullscreenController } from './fullscreen';
import { VideoPresentationController } from './presentation';

/**
 * The `<vds-video>` element adapts the underlying `<video>` element to satisfy the media provider
 * contract, which generally involves providing a consistent API for loading, managing, and
 * tracking media state.
 *
 * Most the logic for this element is contained in the `Html5MediaElement` class because both the
 * `<audio>` and `<video>` elements implement the native `HTMLMediaElement` interface.
 *
 * @tagname vds-video
 * @slot - Used to pass in the `<video>` element.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video}
 * @events ./presentation/events.ts
 * @cssprop --vds-video-width - The width of the video element.
 * @cssprop --vds-video-height - The height of the video element.
 * @cssprop --vds-video-bg-color - The background color of the video content.
 * @example
 * ```html
 * <vds-video poster="https://media-files.vidstack.io/poster.png">
 *   <video
 *     controls
 *     preload="none"
 *     src="https://media-files.vidstack.io/720p.mp4"
 *     poster="https://media-files.vidstack.io/poster-seo.png"
 *   ></video>
 * </vds-video>
 * ```
 * @example
 * ```html
 * <vds-video poster="https://media-files.vidstack.io/poster.png">
 *   <video
 *     controls
 *     preload="none"
 *     poster="https://media-files.vidstack.io/poster-seo.png"
 *   >
 *     <source
 *       src="https://media-files.vidstack.io/720p.mp4"
 *       type="video/mp4"
 *     />
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
          background-color: var(--vds-video-bg-color, #000);
        }

        :host([hidden]) {
          display: none;
        }

        :|slotted(video:not([width])) {
          width: var(--vds-video-width, 100%);
        }

        :|slotted(video:not([height])) {
          height: var(--vds-video-height, auto);
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
