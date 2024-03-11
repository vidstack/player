import {
  deferredPromise,
  isBoolean,
  isNull,
  isString,
  type DeferredPromise,
} from 'maverick.js/std';

import type { Src } from '../core/api/src-types';
import { isAudioSrc, isVideoSrc } from './mime';

export function appendParamsToURL(baseUrl: string, params: Record<string, any>) {
  const searchParams = new URLSearchParams();

  for (const key of Object.keys(params)) {
    searchParams.set(key, params[key] + '');
  }

  return baseUrl + '?' + searchParams.toString();
}

export function preconnect(
  url: string,
  rel: 'preconnect' | 'prefetch' | 'preload' = 'preconnect',
): boolean {
  if (__SERVER__) return false;

  const exists = document.querySelector(`link[href="${url}"]`);
  if (!isNull(exists)) return true;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = url;
  link.crossOrigin = 'true';

  document.head.append(link);
  return true;
}

const pendingRequests: Record<string, DeferredPromise<void>> = {};
export function loadScript(src: string): Promise<void> {
  if (pendingRequests[src]) return pendingRequests[src].promise;

  const promise = deferredPromise(),
    exists = document.querySelector(`script[src="${src}"]`);

  if (!isNull(exists)) {
    promise.resolve();
    return promise.promise;
  }

  const script = document.createElement('script');
  script.src = src;

  script.onload = () => {
    promise.resolve();
    delete pendingRequests[src];
  };

  script.onerror = () => {
    promise.reject();
    delete pendingRequests[src];
  };

  setTimeout(() => document.head.append(script), 0);
  return promise.promise;
}

export function getRequestCredentials(crossOrigin?: string | null): RequestCredentials | undefined {
  return crossOrigin === 'use-credentials'
    ? 'include'
    : isString(crossOrigin)
      ? 'same-origin'
      : undefined;
}

export type FileDownloadInfo = boolean | string | { url: string; filename: string } | null;

export function getDownloadFile({
  title,
  src,
  download,
}: {
  src: Src;
  title: string;
  download?: FileDownloadInfo;
}) {
  const url =
    isBoolean(download) || download === ''
      ? src.src
      : isString(download)
        ? download
        : download?.url;

  if (!isValidFileDownload({ url, src, download })) return null;

  return {
    url,
    name:
      (!isBoolean(download) && !isString(download) && download?.filename) ||
      title.toLowerCase() ||
      'media',
  };
}

function isValidFileDownload({
  url,
  src,
  download,
}: {
  url: unknown;
  src: Src;
  download?: FileDownloadInfo;
}) {
  return isString(url) && ((download && download !== true) || isAudioSrc(src) || isVideoSrc(src));
}
