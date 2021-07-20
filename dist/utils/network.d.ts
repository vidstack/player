/**
 * Attempt to parse json into a POJO.
 *
 * @template T
 * @param {unknown} json - The JSON object to parse.
 * @returns {T | undefined}
 */
export function tryParseJSON<T_1>(json: unknown): T_1 | undefined;
/**
 * Check if the given `value` is JSON or a POJO.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean}
 */
export function isObjOrJSON(value: unknown): boolean;
/**
 * If an object return otherwise try to parse it as json.
 *
 * @template T
 * @param {unknown} value
 * @returns {T | undefined}
 */
export function objOrParseJSON<T_1>(value: unknown): T_1 | undefined;
/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 *
 * @param {string} src - The URL of where the image resource is located.
 * @param {number} minWidth - The minimum width for a valid image to be loaded.
 * @returns {Promise<HTMLImageElement>}
 */
/**
 * @param {string} src
 * @param {number} minWidth
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src: string, minWidth?: number): Promise<HTMLImageElement>;
/**
 * Loads a script into the DOM.
 *
 * @param {string} src - The URL of where the script is located.
 * @param {() => void} onLoad - Callback invoked when the script is loaded.
 * @param {(error: unknown) => void} onError - Callback invoked when the script loading fails.
 */
/**
 * @param {string} src
 * @param {() => void} onLoad
 * @param {() => void} onError
 */
export function loadScript(src: string, onLoad?: () => void, onError?: () => void): void;
/**
 * Tries to parse json and return a object.
 *
 * @template T
 * @param {unknown} data
 * @returns {T | undefined}
 */
export function decodeJSON<T_1>(data: unknown): T_1 | undefined;
/**
 * Attempts to safely decode a URI component, on failure it returns the given fallback.
 *
 * @param {string} component
 * @param {string} fallback
 * @param {boolean} isClient
 * @returns {string}
 */
export function tryDecodeURIComponent(component: string, fallback?: string, isClient?: boolean): string;
/**
 * @param {string} qs
 * @returns {Params}
 */
export function parseQueryString(qs: string): Params;
/**
 * @typedef {Record<string, unknown>} Params
 */
/**
 * Serializes the given params into a query string.
 *
 * @param {Params} params
 * @returns {string}
 */
export function serializeQueryString(params: Params): string;
/**
 * Notifies the browser to start establishing a connection with the given URL.
 *
 * @param {string} url
 * @param {'preconnect' | 'prefetch' | 'preload'} rel
 * @param {boolean} isClient
 * @returns {boolean}
 */
export function preconnect(url: string, rel?: 'preconnect' | 'prefetch' | 'preload', isClient?: boolean): boolean;
/**
 * Safely appends the given query string to the given URL.
 *
 * @param {string} url
 * @param {string} [qs]
 * @returns {string}
 */
export function appendQueryStringToURL(url: string, qs?: string | undefined): string;
/**
 * Serializes the given params into a query string and appends them to the given URL.
 *
 * @param {string} url
 * @param {string | Params} params
 * @returns {string}
 */
export function appendParamsToURL(url: string, params: string | Params): string;
/**
 * Tries to convert a query string into a object.
 *
 * @template T
 * @param {string} qs
 * @returns {T | undefined}
 */
export function decodeQueryString<T_1>(qs: string): T_1 | undefined;
export type Params = Record<string, unknown>;
