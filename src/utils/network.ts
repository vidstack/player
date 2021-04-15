import { IS_CLIENT } from './support';
import { isArray, isNil, isObject, isString, isUndefined, noop } from './unit';

/**
 * Attempt to parse json into a POJO.
 *
 * @param json - The JSON object to parse.
 */
export function tryParseJSON<T>(json: unknown): T | undefined {
  if (!isString(json)) return undefined;

  try {
    return JSON.parse(json);
  } catch (error) {
    return undefined;
  }
}

/**
 * Check if the given value is JSON or a POJO.
 *
 * @param value - The value to check.
 */
export const isObjOrJSON = (value: unknown): boolean =>
  !isNil(value) &&
  (isObject(value) || (isString(value) && value.startsWith('{')));

/**
 * If an object return otherwise try to parse it as json.
 */
export const objOrParseJSON = <T>(value: unknown): T | undefined =>
  (isObject(value) ? value : tryParseJSON(value)) as T;

/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 *
 * @param src - The URL of where the image resource is located.
 * @param minWidth - The minimum width for a valid image to be loaded.
 */
/* c8 ignore next 12 */
export const loadImage = (
  src: string,
  minWidth = 1,
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    const handler = () => {
      image.naturalWidth >= minWidth ? resolve(image) : reject(image);
    };

    Object.assign(image, { onload: handler, onerror: handler, src });
  });

/**
 * Loads a script into the DOM.
 *
 * @param src - The URL of where the script is located.
 * @param onLoad - Callback invoked when the script is loaded.
 * @param onError - Callback invoked when the script loading fails.
 */
/* c8 ignore next 14 */
export const loadScript = (
  src: string,
  onLoad: () => void,
  onError: (e: unknown) => void = noop,
): void => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = onLoad;
  script.onerror = onError;

  const firstScriptTag = document.getElementsByTagName('script')[0];
  if (!isNil(firstScriptTag.parentNode)) {
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
  }
};

/**
 * Tries to parse json and return a object.
 */
export const decodeJSON = <T>(data: unknown): T | undefined => {
  if (!isObjOrJSON(data)) return undefined;
  return objOrParseJSON(data);
};

/**
 * Attempts to safely decode a URI component, on failure it returns the given fallback.
 */
export const tryDecodeURIComponent = (
  component: string,
  fallback = '',
  isClient = IS_CLIENT,
): string => {
  if (!isClient) return fallback;
  try {
    return window.decodeURIComponent(component);
  } catch (error) {
    return fallback;
  }
};

/**
 * Returns a simple key/value map and duplicate keys are merged into an array.
 *
 * @link https://github.com/ampproject/amphtml/blob/c7c46cec71bac92f5c5da31dcc6366c18577f566/src/url-parse-query-string.js#L31
 */
const QUERY_STRING_REGEX = /(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;
export const parseQueryString = <T>(qs?: string): T => {
  const params = Object.create(null);

  if (isUndefined(qs)) return params;

  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = QUERY_STRING_REGEX.exec(qs))) {
    const name = tryDecodeURIComponent(match[1], match[1]).replace('[]', '');

    const value = isString(match[2])
      ? tryDecodeURIComponent(match[2].replace(/\+/g, ' '), match[2])
      : '';

    const currValue = params[name];

    if (currValue && !isArray(currValue)) params[name] = [currValue];

    currValue ? params[name].push(value) : (params[name] = value);
  }

  return params;
};

export type Params = Record<string, unknown>;

/**
 * Serializes the given params into a query string.
 */
export const serializeQueryString = (params: Params): string => {
  const qs: string[] = [];

  const appendQueryParam = (param: string, v: string) => {
    qs.push(`${encodeURIComponent(param)}=${encodeURIComponent(v)}`);
  };

  Object.keys(params).forEach(param => {
    const value = params[param];

    if (isNil(value)) return;

    if (isArray(value)) {
      (value as string[]).forEach((v: string) => appendQueryParam(param, v));
    } else {
      appendQueryParam(param, value as string);
    }
  });

  return qs.join('&');
};

/**
 * Notifies the browser to start establishing a connection with the given URL.
 */
export const preconnect = (
  url: string,
  rel: 'preconnect' | 'prefetch' | 'preload' = 'preconnect',
  isClient = IS_CLIENT,
): boolean => {
  if (!isClient) return false;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = url;
  link.crossOrigin = 'true';

  document.head.append(link);

  return true;
};

/**
 * Safely appends the given query string to the given URL.
 */
export const appendQueryStringToURL = (url: string, qs?: string): string => {
  if (isUndefined(qs) || qs.length === 0) return url;
  const mainAndQuery = url.split('?', 2);
  return (
    mainAndQuery[0] +
    (!isUndefined(mainAndQuery[1]) ? `?${mainAndQuery[1]}&${qs}` : `?${qs}`)
  );
};

/**
 * Serializes the given params into a query string and appends them to the given URL.
 */
export const appendParamsToURL = (
  url: string,
  params: string | Params,
): string =>
  appendQueryStringToURL(
    url,
    isObject(params)
      ? serializeQueryString(params as Params)
      : (params as string),
  );

/**
 * Tries to convert a query string into a object.
 */
export const decodeQueryString = <T>(qs: string): T | undefined => {
  if (!isString(qs)) return undefined;
  return parseQueryString(qs);
};
