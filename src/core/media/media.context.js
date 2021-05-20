import { createContext, derivedContext } from '../../shared/context';
import { MediaType } from './MediaType';
import { createTimeRanges } from './time-ranges';
import { ViewType } from './ViewType';

/**
 * @template T
 * @typedef {import('../../types/context').Context<T>} Context<T>
 */

// Decalred here as they are used within derived contexts below.
const buffered = createContext(createTimeRanges());
const duration = createContext(NaN);
const mediaType = createContext(MediaType.Unknown);
const seekable = createContext(createTimeRanges());
const viewType = createContext(ViewType.Unknown);

/**
 * The media context record contains a collection of contexts that map 1:1 with media
 * state. This context enables state to be passed down to elements lower in the media
 * subtree. It's updated by the media controller. If you're creating your own elements to place
 * inside the media container you can use it like so...
 *
 * ```js
 * import { mediaContext, VdsElement } from "@vidstack/elements";
 *
 * class MyElement extends VdsElement {
 *  paused = mediaContext.paused.consume(this);
 * }
 * ```
 */
export const mediaContext = {
	autoplay: createContext(false),
	buffered,
	bufferedAmount: derivedContext(
		[buffered, duration],
		([buffered, duration]) => {
			const end = buffered.length === 0 ? 0 : buffered.end(buffered.length - 1);
			return end > duration ? duration : end;
		}
	),
	canRequestFullscreen: createContext(false),
	canPlay: createContext(false),
	canPlayThrough: createContext(false),
	controls: createContext(false),
	currentPoster: createContext(''),
	currentSrc: createContext(''),
	currentTime: createContext(0),
	duration,
	ended: createContext(false),
	error: /** @type {Context<unknown | undefined>} */ (createContext(undefined)),
	fullscreen: createContext(false),
	isAudio: derivedContext([mediaType], ([m]) => m === MediaType.Audio),
	isAudioView: derivedContext([viewType], ([v]) => v === ViewType.Audio),
	isVideo: derivedContext([mediaType], ([m]) => m === MediaType.Video),
	isVideoView: derivedContext([viewType], ([v]) => v === ViewType.Video),
	isLiveVideo: derivedContext([mediaType], ([m]) => m === MediaType.LiveVideo),
	loop: createContext(false),
	mediaType,
	muted: createContext(false),
	paused: createContext(true),
	played: createContext(createTimeRanges()),
	playing: createContext(false),
	playsinline: createContext(false),
	seekable,
	seekableAmount: derivedContext(
		[seekable, duration],
		([seekable, duration]) => {
			const end = seekable.length === 0 ? 0 : seekable.end(seekable.length - 1);
			return end > duration ? duration : end;
		}
	),
	seeking: createContext(false),
	started: createContext(false),
	viewType,
	volume: createContext(1),
	waiting: createContext(false)
};

/**
 * Media context properties that should be reset when media is changed.
 */
export const mediaPropsToResetOnSrcChange = new Set([
	'buffered',
	'buffering',
	'canPlay',
	'canPlayThrough',
	'currentSrc',
	'currentTime',
	'duration',
	'ended',
	'mediaType',
	'paused',
	'canPlay',
	'played',
	'playing',
	'seekable',
	'seeking',
	'started',
	'waiting'
]);

// TODO: Can we simplify the following? Need a clean solution for passing the media context record
// down from the media controller to the media provider so it can manage it.

/** @type {import('../../types/context').ContextProviderRecord<typeof mediaContext>} */
const initialMediaContextProviderRecord = Object.keys(mediaContext).reduce(
	(state, contextProp) => ({
		...state,
		[contextProp]: mediaContext[contextProp].initialValue
	}),
	/** @type {any} */ ({})
);

export const mediaContextProviderRecord = createContext(
	initialMediaContextProviderRecord
);
