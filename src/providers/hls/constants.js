import { LIB_PREFIX } from '../../shared/constants';

export const HLS_ELEMENT_TAG_NAME = `hls`;

export const VDS_HLS_ELEMENT_TAG_NAME =
	/** @type {`${typeof LIB_PREFIX}-${typeof HLS_ELEMENT_TAG_NAME}`} */ (
		`${LIB_PREFIX}-${HLS_ELEMENT_TAG_NAME}`
	);

export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i;

export const HLS_TYPES = new Set([
	'application/x-mpegURL',
	'application/vnd.apple.mpegurl'
]);
