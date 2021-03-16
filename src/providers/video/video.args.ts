import { ProviderProps } from '../../core';
import { FILE_PROVIDER_STORYBOOK_ARG_TYPES, FileProviderProps } from '../file';
import { VideoControlsList } from './video.types';

export interface VideoProviderProps extends FileProviderProps, ProviderProps {
  /**
   * A URL for an image to be shown while the video is downloading. If this attribute isn't
   * specified, nothing is displayed until the first frame is available, then the first frame is
   * shown as the poster frame.
   */
  poster?: string;

  /**
   * Reflects the muted attribute, which indicates whether the audio output should be muted by
   * default.  This property has no dynamic effect. To mute and unmute the audio output, use
   * the `muted` property.
   */
  defaultMuted: boolean;

  /**
   * Determines what controls to show on the media element whenever the browser shows its own set
   * of controls (e.g. when the controls attribute is specified).
   *
   * @example 'nodownload nofullscreen noremoteplayback'
   */
  controlsList?: VideoControlsList;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Whether the browser should automatically toggle picture-in-picture mode as
   * the user switches back and forth between this document and another document or application.
   */
  autoPiP?: boolean;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Prevents the browser from suggesting a picture-in-picture context menu or
   * to request picture-in-picture automatically in some cases.
   */
  disablePiP?: boolean;

  /**
   * 🧑‍🔬 **EXPERIMENTAL:** Whether to disable the capability of remote playback in devices that are
   * attached using wired (HDMI, DVI, etc.) and wireless technologies (Miracast, Chromecast,
   * DLNA, AirPlay, etc).
   */
  disableRemotePlayback?: boolean;
}

export type VideoProviderStorybookArgs = {
  [P in keyof VideoProviderProps]: unknown;
};

export const VIDEO_PROVIDER_STORYBOOK_ARG_TYPES: Partial<VideoProviderStorybookArgs> = {
  ...FILE_PROVIDER_STORYBOOK_ARG_TYPES,
  poster: {
    control: 'text',
    defaultValue: 'https://media.vidstack.io/poster.png',
  },
  controlsList: {
    control: 'text',
    defaultValue: undefined,
  },
  autoPiP: {
    control: 'boolean',
    defaultValue: false,
  },
  disablePiP: {
    control: 'boolean',
    defaultValue: false,
  },
  disableRemotePlayback: {
    control: 'boolean',
    defaultValue: false,
  },
};
