import { ProviderProps } from '../../core';
import {
  FileProviderMethods,
  FileProviderProps,
  MediaFileProviderEngine,
} from '../file';

export type VideoProviderEngine = MediaFileProviderEngine;

export type VideoControlsList =
  | 'nodownload'
  | 'nofullscreen'
  | 'noremoteplayback';

export interface VideoProviderProps extends FileProviderProps, ProviderProps {
  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as
   * the user switches back and forth between this document and another document or application.
   */
  autoPiP?: boolean;

  /**
   * Determines what controls to show on the media element whenever the browser shows its own set
   * of controls (e.g. when the controls attribute is specified).
   *
   * @example 'nodownload nofullscreen noremoteplayback'
   * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList
   */
  controlsList?: VideoControlsList;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or
   * to request picture-in-picture automatically in some cases.
   *
   * @spec https://w3c.github.io/picture-in-picture/#disable-pip
   */
  disablePiP?: boolean;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are
   * attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast,
   * DLNA, AirPlay, etc).
   *
   * @spec https://www.w3.org/TR/remote-playback/#the-disableremoteplayback-attribute
   *
   */
  disableRemotePlayback?: boolean;

  /**
   * A URL for an image to be shown while the video is downloading. If this attribute isn't
   * specified, nothing is displayed until the first frame is available, then the first frame is
   * shown as the poster frame.
   */
  poster?: string;
}

export type VideoProviderMethods = FileProviderMethods;

// V8ToIstanbul fails when no value is exported.
export default class {}
