import { deferredPromise } from './promise';
import { IS_CLIENT } from './support';
import {
  isArray,
  isNil,
  isNull,
  isObject,
  isString,
  isUndefined
} from './unit';

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
 * Check if the given `value` is JSON or a POJO.
 *
 * @param value - The value to check.
 */
export function isObjOrJSON(value: unknown): boolean {
  return (isString(value) && value.startsWith('{')) || isObject(value);
}

/**
 * If an object return otherwise try to parse it as json.
 *
 * @param value
 */
export function objOrParseJSON<T>(value: unknown): T | undefined {
  return (isObject(value) ? value : tryParseJSON(value)) as any;
}

/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 *
 * @param src - The URL of where the image resource is located.
 * @param minWidth - The minimum width for a valid image to be loaded.
 */
/* c8 ignore next 10 */
export function loadImage(
  src: string,
  minWidth = 1
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    const handler = () => {
      image.naturalWidth >= minWidth ? resolve(image) : reject(image);
    };

    Object.assign(image, { onload: handler, onerror: handler, src });
  });
}

/**
 * Loads a script into the DOM.
 *
 * @param src The URL of where the script is located.
 */
/* c8 ignore next 22 */
export async function loadScript(src: string): Promise<unknown> {
  const hasLoaded = document.querySelector(`script[src="${src}"]`);

  if (!isNull(hasLoaded)) return;

  const script = document.createElement('script');
  const load = deferredPromise();

  script.src = src;
  script.onload = load.resolve;
  script.onerror = load.reject;

  const firstScriptTag = document.getElementsByTagName('script')[0];
  if (!isNil(firstScriptTag.parentNode)) {
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
  }

  return load.promise;
}

/**
 * Tries to parse json and return a object.
 *
 * @param data
 */
export function decodeJSON<T>(data: unknown): T | undefined {
  if (!isObjOrJSON(data)) return undefined;
  return objOrParseJSON(data);
}

/**
 * Attempts to safely decode a URI component, on failure it returns the given fallback.
 *
 * @param component
 * @param fallback
 * @param isClient
 */
export function tryDecodeURIComponent(
  component: string,
  fallback = '',
  isClient = IS_CLIENT
): string {
  if (!isClient) return fallback;

  try {
    return window.decodeURIComponent(component);
  } catch (error) {
    return fallback;
  }
}

const QUERY_STRING_REGEX = /(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;

/**
 * Returns a simple key/value map and duplicate keys are merged into an array.
 *
 * @param qs - The query string to parse.
 * @link https://github.com/ampproject/amphtml/blob/c7c46cec71bac92f5c5da31dcc6366c18577f566/src/url-parse-query-string.js#L31
 */
export function parseQueryString<T>(qs?: string): T {
  const params = Object.create(null);

  if (isUndefined(qs)) return params;

  let match: RegExpExecArray;

  while ((match = QUERY_STRING_REGEX.exec(qs) as RegExpExecArray)) {
    const name = tryDecodeURIComponent(match[1], match[1]).replace('[]', '');

    const value = isString(match[2])
      ? tryDecodeURIComponent(match[2].replace(/\+/g, ' '), match[2])
      : '';

    const currValue = params[name];

    if (currValue && !isArray(currValue)) params[name] = [currValue];

    currValue ? params[name].push(value) : (params[name] = value);
  }

  return params;
}

export type Params = Record<string, unknown>;

/**
 * Serializes the given params into a query string.
 *
 * @param params
 */
export function serializeQueryString(params: Params): string {
  const qs: string[] = [];

  const appendQueryParam = (param: string, v: string) => {
    qs.push(`${encodeURIComponent(param)}=${encodeURIComponent(v)}`);
  };

  Object.keys(params).forEach((param) => {
    const value = params[param];

    if (isNil(value)) return;

    if (isArray(value)) {
      (value as string[]).forEach((v) => appendQueryParam(param, v));
    } else {
      appendQueryParam(param, value as string);
    }
  });

  return qs.join('&');
}

/**
 * Notifies the browser to start establishing a connection with the given URL.
 *
 * @param url
 * @param rel
 * @param isClient
 */
export function preconnect(
  url: string,
  rel: 'preconnect' | 'prefetch' | 'preload' = 'preconnect',
  isClient = IS_CLIENT
): boolean {
  if (!isClient) return false;

  const hasLink = document.querySelector(`link[href="${url}"]`);

  if (!isNull(hasLink)) return true;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = url;
  link.crossOrigin = 'true';

  document.head.append(link);

  return true;
}

/**
 * Safely appends the given query string to the given URL.
 *
 * @param url
 * @param qs
 */
export function appendQueryStringToURL(url: string, qs?: string): string {
  if (isUndefined(qs) || qs.length === 0) return url;
  const mainAndQuery = url.split('?', 2);
  return (
    mainAndQuery[0] +
    (!isUndefined(mainAndQuery[1]) ? `?${mainAndQuery[1]}&${qs}` : `?${qs}`)
  );
}

/**
 * Serializes the given params into a query string and appends them to the given URL.
 *
 * @param url
 * @param params
 */
export function appendParamsToURL(
  url: string,
  params: string | Params
): string {
  return appendQueryStringToURL(
    url,
    isObject(params) ? serializeQueryString(params) : params
  );
}

/**
 * Tries to convert a query string into a object.
 *
 * @param qs
 */
export function decodeQueryString<T>(qs: string): T | undefined {
  if (!isString(qs)) return undefined;
  return parseQueryString(qs);
}

export class ScriptLoader {
  private static pendingRequests: Record<
    string,
    {
      resolve: () => void;
      reject: (error: unknown) => void;
    }[]
  > = {};

  static async load(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.pendingRequests[src]) {
        this.pendingRequests[src].push({ resolve, reject });
        return;
      }

      this.pendingRequests[src] = [{ resolve, reject }];

      loadScript(src)
        .then(() => {
          this.pendingRequests[src].forEach((request) => request.resolve());
          delete this.pendingRequests[src];
        })
        .catch((err) => {
          this.pendingRequests[src].forEach((request) => request.reject(err));
          delete this.pendingRequests[src];
        });
    });
  }
}
