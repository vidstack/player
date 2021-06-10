import { LIB_PREFIX } from '../../shared/constants';

export const VIDEO_ELEMENT_TAG_NAME = `video`;

export const VDS_VIDEO_ELEMENT_TAG_NAME =
	/** @type {`${typeof LIB_PREFIX}-${typeof VIDEO_ELEMENT_TAG_NAME}`} */ (
		`${LIB_PREFIX}-${VIDEO_ELEMENT_TAG_NAME}`
	);

export const AUDIO_EXTENSIONS =
	/\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;
