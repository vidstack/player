import type * as React from 'react';

export interface RemotionSrc<InputProps extends RemotionInputProps = RemotionInputProps> {
  /** React component which is generally a Remotion video. */
  src: React.ComponentType;
  /** Remotion source type. */
  type: 'video/remotion';
  /**
   * Pass props to the component that you have specified using the component prop.
   */
  inputProps?: InputProps;
  /**
   * The width of the composition.
   *
   * @defaultValue 1920
   */
  compositionWidth?: number;
  /**
   * The height of the composition.
   *
   * @defaultValue 1080
   */
  compositionHeight?: number;
  /**
   * The frame rate of the video per second.
   *
   * @defaultValue 30
   */
  fps?: number;
  /**
   * The duration of the video in frames. Must be an integer and greater than 0.
   */
  durationInFrames: number;
  /**
   * Start the playback from a specific frame.
   *
   * @defaultValue 0
   */
  initialFrame?: number;
  /**
   * Limit playback to only play after a certain frame. The video will start from this frame and
   * move to this position once it has ended. Must be an integer, not smaller than 0, not bigger
   * than `outFrame` and not bigger than `durationInFrames - 1`.
   *
   * @defaultValue 0
   */
  inFrame?: number | null;
  /**
   * Limit playback to only play before a certain frame. The video will end at this frame
   * and move to the beginning once it has ended. Must be an integer, not smaller than 1, not
   * smaller than `inFrame` and not bigger than `durationInFrames`.
   *
   * @defaultValue `durationInFrames`
   */
  outFrame?: number;
  /**
   * If you use an `<Audio />` tag, it might not play in some browsers (specifically iOS Safari)
   * due to browser autoplay policies. This is why the player pre-mounts a set of audio tags with
   * silent audio that get played upon user interaction. These audio tags can then be used to play
   * real audio later and will not be subject to the autoplay policy of the browser.
   *
   * This option controls how many audio tags are being rendered, the default is 5. If you mount
   * more audio tags than shared audio tags are available, then an error will be thrown.
   *
   * If you'd like to opt out of this behavior, you can pass 0 to mount native audio tags
   * simultaneously as you mount Remotion's <Audio /> tags.
   *
   * @defaultValue 5
   */
  numberOfSharedAudioTags?: number;
  /**
   * A callback function that allows you to return a custom UI that gets displayed while the
   * provider is loading.
   */
  renderLoading?: RemotionLoadingRenderer;
  /**
   * A callback for rendering a custom error message.
   */
  errorFallback?: RemotionErrorRenderer;
  /**
   * Called when an error or uncaught exception has happened in the video.
   */
  onError?(error: Error): void;
}

export interface RemotionInputProps extends Record<string, unknown> {}

export interface RemotionLoadingRenderer {
  (): React.ReactNode;
}

export interface RemotionErrorRenderer {
  (error: Error): React.ReactNode;
}
