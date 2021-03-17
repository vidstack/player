import { ProviderActions } from '../../core';
import {
  FileProviderMethods,
  FileProviderProps,
  MediaFileProviderEngine,
} from '../file';

export type VideoProviderEngine = MediaFileProviderEngine;

export interface VideoProviderProps extends FileProviderProps {
  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as
   * the user switches back and forth between this document and another document or application.
   */
  autoPiP?: boolean;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or
   * to request picture-in-picture automatically in some cases.
   *
   * @spec https://w3c.github.io/picture-in-picture/#disable-pip
   */
  disablePiP?: boolean;

  /**
   * A URL for an image to be shown while the video is downloading. If this attribute isn't
   * specified, nothing is displayed until the first frame is available, then the first frame is
   * shown as the poster frame.
   */
  poster?: string;
}

export type VideoProviderMethods = FileProviderMethods;

export type VideoProviderActions = ProviderActions;

// V8ToIstanbul fails when no value is exported.
export default class {}
