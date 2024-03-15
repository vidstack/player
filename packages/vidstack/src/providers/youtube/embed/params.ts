/**
 * YouTube Player Parameters.
 *
 * @see {@link https://developers.google.com/youtube/player_parameters}
 */
export interface YouTubeParams {
  /**
   * This parameter specifies whether the initial video will automatically start to play when the
   * player loads. Supported values are 0 or 1.
   *
   * @default 0
   */
  autoplay?: 0 | 1;

  /**
   * This parameter specifies whether the initial video will load with audio muted. Supported values
   * are 0 or 1.
   *
   * @default 0
   */
  mute?: 0 | 1;

  /**
   * This parameter specifies the default language that the player will use to display captions.
   * Set the parameter's value to an ISO 639-1 two-letter language code.
   *
   * If you use this parameter and also set the cc_load_policy parameter to 1, then the player will
   * show captions in the specified language when the player loads. If you do not also set the
   * cc_load_policy parameter, then captions will not display by default, but will display in the
   * specified language if the user opts to turn captions on.
   */
  cc_lang_pref?: string;

  /**
   * Setting the parameter's value to 1 causes closed captions to be shown by default, even if the
   * user has turned captions off. The default behavior is based on user preference.
   */
  cc_load_policy?: 1;

  /**
   * This parameter specifies the color that will be used in the player's video progress bar to
   * highlight the amount of the video that the viewer has already seen. Valid parameter values are
   * red and white, and, by default, the player uses the color red in the video progress bar. See
   * the YouTube API blog for more information about color options.
   *
   * Note: Setting the color parameter to white will disable the `modestbranding` option.
   *
   * @default 'red'
   */
  color?: 'red' | 'white';

  /**
   * This parameter indicates whether the video player controls are displayed:
   *
   * - `controls=0` – Player controls do not display in the player.
   * - `controls=1` – Player controls display in the player.
   *
   * @default 1
   */
  controls?: 0 | 1;

  /**
   * Setting the parameter's value to 1 causes the player to not respond to keyboard controls. The
   * default value is 0, which means that keyboard controls are enabled. Currently supported
   * keyboard controls are:
   *
   * - Spacebar or [k]: Play / Pause
   * - Arrow Left: Jump back 5 seconds in the current video
   * - Arrow Right: Jump ahead 5 seconds in the current video
   * - Arrow Up: Volume up
   * - Arrow Down: Volume Down
   * - [f]: Toggle full-screen display
   * - [j]: Jump back 10 seconds in the current video
   * - [l]: Jump ahead 10 seconds in the current video
   * - [m]: Mute or unmute the video
   * - [0-9]: Jump to a point in the video. 0 jumps to the beginning of the video, 1 jumps to the
   * point 10% into the video, 2 jumps to the point 20% into the video, and so forth.
   *
   * @default 0
   */
  disablekb?: 0 | 1;

  /**
   * Setting the parameter's value to 1 enables the player to be controlled via IFrame or JavaScript
   * Player API calls. The default value is 0, which means that the player cannot be controlled
   * using those APIs.
   *
   * For more information on the IFrame API and how to use it, see the IFrame API documentation.
   * (The JavaScript Player API has already been deprecated.)
   *
   * @default 0
   */
  enablejsapi?: 0 | 1;

  /**
   * This parameter causes the player to begin playing the video at the given number of seconds
   * from the start of the video. The parameter value is a positive integer. Note that similar to
   * the seekTo function, the player will look for the closest keyframe to the time you specify.
   * This means that sometimes the play head may seek to just before the requested time, usually no
   * more than around two seconds.
   *
   * @default undefined
   */
  start?: number;

  /**
   * This parameter specifies the time, measured in seconds from the start of the video, when the
   * player should stop playing the video. The parameter value is a positive integer.
   *
   * Note: The time is measured from the beginning of the video and not from either the value of
   * the start player parameter or the startSeconds parameter, which is used in YouTube Player API
   * functions for loading or queueing a video.
   *
   * @default undefined
   */
  end?: number;

  /**
   * Setting this parameter to 0 prevents the fullscreen button from displaying in the player. The
   * default value is 1, which causes the fullscreen button to display.
   *
   * @default 1
   */
  fs?: 0 | 1;

  /**
   * Sets the player's interface language. The parameter value is an ISO 639-1 two-letter language
   * code or a fully specified locale. For example, fr and fr-ca are both valid values. Other
   * language input codes, such as IETF language tags (BCP 47) might also be handled properly.
   *
   * The interface language is used for tooltips in the player and also affects the default caption
   * track. Note that YouTube might select a different caption track language for a particular user
   * based on the user's individual language preferences and the availability of caption tracks.
   */
  hl?: string;

  /**
   * Setting the parameter's value to 1 causes video annotations to be shown by default, whereas
   * setting to 3 causes video annotations to not be shown by default.
   *
   * @default 1
   */
  iv_load_policy?: 1 | 3;

  /**
   * The `list` parameter, in conjunction with the `listType` parameter, identifies the content that
   * will load in the player.
   *
   * - If the `listType` parameter value is search, then the list parameter value specifies the
   * search query.
   *
   * - If the `listType` parameter value is user_uploads, then the list parameter value identifies
   * the YouTube channel whose uploaded videos will be loaded.
   *
   * - If the listType parameter value is playlist, then the list parameter value specifies a
   * YouTube playlist ID. In the parameter value, you need to prepend the playlist ID with the
   * letters PL as shown in the example below.
   *
   * Note: If you specify values for the `list` and `listType` parameters, the IFrame embed URL does
   * not need to specify a video ID.
   *
   * @default undefined
   */
  list?: string;

  /**
   * The listType parameter, in conjunction with the list parameter, identifies the content that
   * will load in the player. Valid parameter values are playlist, search, and user_uploads.
   *
   * Note: If you specify values for the list and listType parameters, the IFrame embed URL does
   * not need to specify a video ID.
   *
   * @default undefined
   */
  listType?: 'playlist' | 'search' | 'user_uploads';

  /**
   * In the case of a single video player, a setting of 1 causes the player to play the initial
   * video again and again. In the case of a playlist player (or custom player), the player plays
   * the entire playlist and then starts again at the first video.
   *
   * @default 0
   */
  loop?: 0 | 1;

  /**
   * This parameter provides an extra security measure for the IFrame API and is only supported for
   * IFrame embeds. If you are using the IFrame API, which means you are setting the enablejsapi
   * parameter value to 1, you should always specify your domain as the origin parameter value.
   *
   * @default undefined
   */
  origin?: string;

  /**
   * This parameter specifies a comma-separated list of video IDs to play. If you specify a value,
   * the first video that plays will be the VIDEO_ID specified in the URL path, and the videos
   * specified in the playlist parameter will play thereafter.
   *
   * @default undefined
   */
  playlist?: string;

  /**
   * This parameter controls whether videos play inline or fullscreen in an HTML5 player on iOS.
   *
   * Valid values are:
   *
   * - 0: This value causes fullscreen playback.
   *
   * - 1: This value causes inline playback for UIWebViews created with the
   * `allowsInlineMediaPlayback` property set to `true`.
   *
   * @default 0
   */
  playsinline?: 0 | 1;

  /**
   * If the rel parameter is set to 0, related videos will come from the same channel as the video
   * that was just played. If the parameter's value is set to 1, which is the default value, then
   * the player shows related videos.
   *
   * @default 1
   */
  rel?: 0 | 1;

  /**
   * This parameter identifies the URL where the player is embedded. This value is used in YouTube
   * Analytics reporting when the YouTube player is embedded in a widget, and that widget is then
   * embedded in a web page or application. In that scenario, the origin parameter identifies the
   * widget provider's domain, but YouTube Analytics should not identify the widget provider as the
   * actual traffic source. Instead, YouTube Analytics uses the widget_referrer parameter value to
   * identify the domain associated with the traffic source.
   *
   * @default undefined
   */
  widget_referrer?: string;
}
