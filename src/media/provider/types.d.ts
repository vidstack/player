import { FullscreenHost } from '../../shared/fullscreen';
import { ScreenOrientationHost } from '../../shared/screen-orientation';
import { CanPlay } from '../CanPlay';
import { MediaType } from '../MediaType';
import { ViewType } from '../ViewType';

export type MediaProvider = MediaProviderElementProps &
	MediaProviderElementMethods &
	FullscreenHost &
	ScreenOrientationHost;

export type MediaProviderElementWritableProps = Pick<
	MediaProviderElementProps,
	| 'autoplay'
	| 'controls'
	| 'currentTime'
	| 'muted'
	| 'loop'
	| 'paused'
	| 'playsinline'
	| 'volume'
>;

export type MediaProviderElementReadonlyProps = Readonly<
	Omit<MediaProviderElementProps, keyof MediaProviderElementWritableProps>
>;

export interface MediaProviderElementProps {
	/**
	 * Whether playback should automatically begin as soon as enough media is available to do so
	 * without interruption.
	 *
	 * Sites which automatically play audio (or videos with an audio track) can be an unpleasant
	 * experience for users, so it should be avoided when possible. If you must offer autoplay
	 * functionality, you should make it opt-in (requiring a user to specifically enable it).
	 *
	 * However, autoplay can be useful when creating media elements whose source will be set at a
	 * later time, under user control.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/autoplay
	 */
	autoplay: boolean;

	/**
	 * Returns a `TimeRanges` object that indicates the ranges of the media source that the
	 * browser has buffered (if any) at the moment the buffered property is accessed. This is usually
	 * contiguous but if the user jumps about while media is buffering, it may contain holes.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered
	 *
	 * @default TimeRanges
	 */
	readonly buffered: TimeRanges;

	/**
	 * Whether the user agent can play the media, but estimates that **not enough** data has been
	 * loaded to play the media up to its end without having to stop for further buffering of
	 * content.
	 *
	 * @default false
	 */
	readonly canPlay: boolean;

	/**
	 * Whether the user agent can play the media, and estimates that enough data has been
	 * loaded to play the media up to its end without having to stop for further buffering
	 * of content.
	 *
	 * @default false
	 */
	readonly canPlayThrough: boolean;

	/**
	 * Whether the native browser fullscreen API is available, or the current provider can
	 * toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
	 * only that it can be attempted.
	 *
	 * @default false
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
	 */
	readonly canRequestFullscreen: boolean;

	/**
	 * Indicates whether a user interface should be shown for controlling the resource. Set this to
	 * `false` when you want to provide your own custom controls, and `true` if you want the current
	 * provider to supply its own default controls. Depending on the provider, changing this prop
	 * may cause the player to completely reset.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controls
	 */
	controls: boolean;

	/**
	 * The URL of the current poster. Defaults to `''` if no media/poster has been given or
	 * loaded.
	 */
	readonly currentPoster: string;

	/**
	 * The absolute URL of the media resource that has been chosen. Defaults to `''` if no
	 * media has been loaded.
	 *
	 * @default ''
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentSrc
	 */
	readonly currentSrc: string;

	/**
	 * A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
	 * not started to play and has not seeked. Setting this value seeks the media to the new
	 * time. The value can be set to a minimum of `0` and maximum of the total length of the
	 * media (indicated by the duration prop).
	 *
	 * @default 0
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
	 */
	currentTime: number;

	/**
	 * A `double` indicating the total playback length of the media in seconds. If no media data is
	 * available, the returned value is `NaN`. If the media is of indefinite length (such as
	 * streamed live media, a WebRTC call's media, or similar), the value is `+Infinity`.
	 *
	 * @default NaN
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/duration
	 */
	readonly duration: number;

	/**
	 * Whether media playback has reached the end. In other words it'll be true
	 * if `currentTime === duration`.
	 *
	 * @default false
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended
	 */
	readonly ended: boolean;

	/**
	 * Contains the most recent error or undefined if there's been none. You can listen for
	 * `vds-error` event updates and examine this object to debug further. The error could be a
	 * native `MediaError` object or something else.
	 *
	 * @default undefined
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error
	 */
	readonly error: unknown | undefined;

	/**
	 * Whether the player is currently in fullscreen mode.
	 *
	 * @default false
	 */
	readonly fullscreen: boolean;

	/**
	 * Whether media should automatically start playing from the beginning (replay) every time
	 * it ends.
	 *
	 * @default false
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop
	 */
	loop: boolean;

	/**
	 * The type of media that is currently active, whether it's audio or video. Defaults
	 * to `unknown` when no media has been loaded or the type cannot be determined.
	 *
	 * @default MediaType.Unknown
	 */
	readonly mediaType: MediaType;

	/**
	 * Whether the audio is muted or not.
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/muted
	 */
	muted: boolean;

	/**
	 * Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
	 * not started. Setting this to `false` will begin/resume playback.
	 *
	 * @default true
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/paused
	 */
	paused: boolean;

	/**
	 * Contains the ranges of the media source that the browser has played, if any.
	 *
	 * @default TimeRanges
	 */
	readonly played: TimeRanges;

	/**
	 * Whether media is actively playing back. Defaults to `false` if no media has
	 * loaded or playback has not started.
	 *
	 * @default false
	 */
	readonly playing: boolean;

	/**
	 * Whether the video is to be played "inline", that is within the element's playback area. Note
	 * that setting this to `false` does not imply that the video will always be played in fullscreen.
	 * Depending on the provider, changing this prop may cause the player to completely reset.
	 */
	playsinline: boolean;

	/**
	 * Contains the time ranges that the user is able to seek to, if any. This tells us which parts
	 * of the media can be played without delay; this is irrespective of whether that part has
	 * been downloaded or not.
	 *
	 * Some parts of the media may be seekable but not buffered if byte-range
	 * requests are enabled on the server. Byte range requests allow parts of the media file to
	 * be delivered from the server and so can be ready to play almost immediately — thus they are
	 * seekable.
	 *
	 * @default TimeRanges
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seekable
	 */
	readonly seekable: TimeRanges;

	/**
	 * Whether media is actively seeking to an new playback position.
	 *
	 * @default false
	 */
	readonly seeking: boolean;

	/**
	 * Whether media playback has started. In other words it will be true if `currentTime > 0`.
	 *
	 * @default false
	 */
	readonly started: boolean;

	/**
	 * The type of player view that is being used, whether it's an audio player view or
	 * video player view. Normally if the media type is of audio then the view is of type audio, but
	 * in some cases it might be desirable to show a different view type. For example, when playing
	 * audio with a poster. This is subject to the provider allowing it. Defaults to `unknown`
	 * when no media has been loaded.
	 *
	 * @default ViewType.Unknown
	 */
	readonly viewType: ViewType;

	/**
	 * An `int` between `0` (silent) and `1` (loudest) indicating the audio volume. Defaults to `1`.
	 *
	 * @default 1
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume
	 */
	volume: number;

	/**
	 * Whether playback has temporarily stopped because of a lack of temporary data.
	 *
	 * @default false
	 */
	readonly waiting: boolean;
}

export interface MediaProviderElementMethods {
	/**
	 * Begins/resumes playback of the media. If this method is called programmatically before the
	 * user has interacted with the player, the promise may be rejected subject to the browser's
	 * autoplay policies.
	 */
	play(): Promise<void>;

	/**
	 * Pauses playback of the media.
	 */
	pause(): Promise<void>;

	/**
	 * Determines if the media provider can play the given `type`. The `type` is
	 * generally the media resource identifier, URL or MIME type (optional Codecs parameter).
	 *
	 * @examples
	 * - `audio/mp3`
	 * - `video/mp4`
	 * - `video/webm; codecs="vp8, vorbis"`
	 * - `/my-audio-file.mp3`
	 * - `youtube/RO7VcUAsf-I`
	 * - `vimeo.com/411652396`
	 * - `https://www.youtube.com/watch?v=OQoz7FCWkfU`
	 * - `https://media.vidstack.io/hls/index.m3u8`
	 * - `https://media.vidstack.io/dash/index.mpd`
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
	 */
	canPlayType(type: string): CanPlay;

	/**
	 * Determines if the media provider "should" play the given type. "Should" in this
	 * context refers to the `canPlayType()` method returning `Maybe` or `Probably`.
	 *
	 * @param type - refer to `canPlayType`.
	 */
	shouldPlayType(type: string): boolean;
}
