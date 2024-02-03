import { effect, peek, signal, type ReadSignal } from 'maverick.js';
import { isArray, isNumber, isObject, isString } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaCrossOrigin } from '../../../core/api/types';
import { assert } from '../../../utils/error';
import { getRequestCredentials } from '../../../utils/network';

const cache = new Map<string, ThumbnailImage[]>(),
  pending = new Map<string, Promise<ThumbnailImage[] | void>>(),
  warned = __DEV__ ? new Set<ThumbnailSrc>() : undefined;

export class ThumbnailsLoader {
  readonly $images = signal<ThumbnailImage[]>([]);

  static create($src: ReadSignal<ThumbnailSrc>, $crossOrigin: ReadSignal<MediaCrossOrigin | null>) {
    const media = useMediaContext();
    return new ThumbnailsLoader($src, $crossOrigin, media);
  }

  constructor(
    readonly $src: ReadSignal<ThumbnailSrc>,
    readonly $crossOrigin: ReadSignal<MediaCrossOrigin | null>,
    private _media: MediaContext,
  ) {
    effect(this._onLoadCues.bind(this));
  }

  protected _onLoadCues() {
    const { canLoad } = this._media.$state;

    if (!canLoad()) return;

    const src = this.$src(),
      abort = new AbortController();

    if (!src) return;

    if (isString(src) && cache.has(src)) {
      // Really basic LRU cache implementation.
      const cues = cache.get(src)!;
      cache.delete(src);
      cache.set(src, cues);

      if (cache.size > 30) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      this.$images.set(cache.get(src)!);
    } else if (isString(src)) {
      const crossOrigin = this.$crossOrigin(),
        currentKey = src + '::' + crossOrigin;

      if (!pending.has(currentKey)) {
        const promise = new Promise<ThumbnailImage[]>(async (resolve, reject) => {
          try {
            const response = await fetch(src, {
                signal: abort.signal,
                credentials: getRequestCredentials(crossOrigin),
              }),
              isJSON = response.headers.get('content-type') === 'application/json';

            if (isJSON) {
              const json = await response.json();

              if (isArray(json)) {
                if (json[0] && 'text' in (json[0] as Partial<VTTCue>)) {
                  resolve(this._processVTTCues(json as any));
                } else {
                  for (let i = 0; i < json.length; i++) {
                    const image = json[i];
                    assert(isObject(image), __DEV__ && `Item not an object at index ${i}`);
                    assert(
                      'url' in image && isString(image.url),
                      __DEV__ && `Invalid or missing \`url\` property at index ${i}`,
                    );
                    assert(
                      'startTime' in image && isNumber(image.startTime),
                      __DEV__ && `Invalid or missing \`startTime\` property at index ${i}`,
                    );
                  }

                  resolve(json as ThumbnailImage[]);
                }
              } else {
                resolve(this._processStoryboard(json));
              }

              return;
            }

            import('media-captions').then(async ({ parseResponse }) => {
              try {
                const { cues } = await parseResponse(response);
                resolve(this._processVTTCues(cues));
              } catch (e) {
                reject(e);
              }
            });
          } catch (e) {
            reject(e);
          }
        })
          .then((images) => {
            if (!abort.signal.aborted) cache.set(currentKey, images);
            return images;
          })
          .catch((error) => {
            if (abort.signal.aborted) return;
            this._onError(src, error);
          })
          .finally(() => {
            if (isString(currentKey)) pending.delete(currentKey);
          });

        pending.set(currentKey, promise);
      }

      pending.get(currentKey)?.then((images) => {
        if (abort.signal.aborted) return;
        this.$images.set(images || []);
      });
    } else if (isArray(src)) {
      try {
        this.$images.set(this._processImages(src));
      } catch (error) {
        this._onError(src, error);
      }
    } else {
      try {
        this.$images.set(this._processStoryboard(src));
      } catch (error) {
        this._onError(src, error);
      }
    }

    return () => {
      abort.abort();
      this.$images.set([]);
    };
  }

  private _processImages(images: ThumbnailImageInit[]): ThumbnailImage[] {
    const baseURL = this._resolveBaseUrl();
    return images.map((img, i) => {
      assert(
        img.url && isString(img.url),
        __DEV__ && `Invalid or missing \`url\` property at index ${i}`,
      );
      assert(
        'startTime' in img && isNumber(img.startTime),
        __DEV__ && `Invalid or missing \`startTime\` property at index ${i}`,
      );
      return {
        ...img,
        url: isString(img.url) ? this._resolveURL(img.url, baseURL) : img.url,
      };
    });
  }

  private _processStoryboard(
    board: Partial<ThumbnailStoryboard> | Partial<MuxThumbnailStoryboard>,
  ) {
    assert(isString(board.url), __DEV__ && 'Missing `url` in storyboard object');
    assert(isArray(board.tiles) && board.tiles?.length, __DEV__ && `Empty tiles in storyboard`);

    const url = new URL(board.url),
      images: ThumbnailImage[] = [];

    const tileWidth =
        'tile_width' in board
          ? board.tile_width
          : (board as Partial<ThumbnailStoryboard>).tileWidth,
      tileHeight =
        'tile_height' in board
          ? board.tile_height
          : (board as Partial<ThumbnailStoryboard>).tileHeight;

    for (const tile of board.tiles) {
      images.push({
        url,
        startTime: 'start' in tile ? tile.start : tile.startTime,
        width: tileWidth,
        height: tileHeight,
        coords: { x: tile.x, y: tile.y },
      });
    }

    return images;
  }

  private _processVTTCues(cues: { startTime?: number; endTime?: number; text?: string }[]) {
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i];
      assert(
        'startTime' in cue && isNumber(cue.startTime),
        __DEV__ && `Invalid or missing \`startTime\` property at index ${i}`,
      );
      assert(
        'text' in cue && isString(cue.text),
        __DEV__ && `Invalid or missing \`text\` property at index ${i}`,
      );
    }

    const images: ThumbnailImage[] = [],
      baseURL = this._resolveBaseUrl();

    for (const cue of cues) {
      const [url, hash] = cue.text!.split('#'),
        data = this._resolveData(hash);
      images.push({
        url: this._resolveURL(url, baseURL),
        startTime: cue.startTime!,
        endTime: cue.endTime,
        width: data?.w,
        height: data?.h,
        coords: data && isNumber(data.x) && isNumber(data.y) ? { x: data.x, y: data.y } : undefined,
      });
    }

    return images;
  }

  private _resolveBaseUrl() {
    let baseURL = peek(this.$src);

    if (!isString(baseURL) || !/^https?:/.test(baseURL)) {
      return location.href;
    }

    return baseURL;
  }

  private _resolveURL(src: string, baseURL: string) {
    return /^https?:/.test(src) ? new URL(src) : new URL(src, baseURL);
  }

  private _resolveData(hash?: string) {
    if (!hash) return {};

    // hash = xywh=0,0,256,160
    const [hashProps, values] = hash.split('='),
      hashValues = values?.split(','),
      data: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
      } = {};

    if (!hashProps || !hashValues) {
      return null;
    }

    for (let i = 0; i < hashProps.length; i++) {
      const value = +hashValues[i];
      if (!isNaN(value)) data[hashProps[i]] = value;
    }

    return data;
  }

  private _onError(src: ThumbnailSrc, error: unknown) {
    if (!__DEV__ || warned?.has(src)) return;

    this._media.logger
      ?.errorGroup('[vidstack] failed to load thumbnails')
      .labelledLog('Src', src)
      .labelledLog('Error', error)
      .dispatch();

    warned?.add(src);
  }
}

export type ThumbnailSrc =
  | string
  | ThumbnailImageInit[]
  | ThumbnailStoryboard
  | MuxThumbnailStoryboard
  | null;

export interface ThumbnailStoryboard {
  url: string;
  tileWidth: number;
  tileHeight: number;
  tiles: ThumbnailTile[];
}

export interface ThumbnailTile {
  startTime: number;
  x: number;
  y: number;
}

export interface MuxThumbnailStoryboard {
  url: string;
  tile_width: number;
  tile_height: number;
  tiles: MuxThumbnailTile[];
}

export interface MuxThumbnailTile {
  start: number;
  x: number;
  y: number;
}

export interface ThumbnailImageInit {
  url: string | URL;
  startTime: number;
  endTime?: number;
  width?: number;
  height?: number;
  coords?: ThumbnailCoords;
}

export interface ThumbnailImage extends Omit<ThumbnailImageInit, 'url'> {
  url: URL;
}

export interface ThumbnailCoords {
  x: number;
  y: number;
}
