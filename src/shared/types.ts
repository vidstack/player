export type Constructor<T = Record<string, unknown>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  prototype: T;
};

export type MethodsOnly<T> = Omit<
  T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  { [K in keyof T]-?: T[K] extends Function ? never : K }[keyof T]
>;

export type Callback<T> = (value: T) => void;

export type Unsubscribe = () => void;

export interface Cancelable {
  cancel(): void;
}

export type CancelableCallback<T> = Callback<T> & Cancelable;

export type WebKitPresentationMode =
  | 'picture-in-picture'
  | 'inline'
  | 'fullscreen';

declare global {
  interface Document {
    pictureInPictureEnabled: boolean;
  }

  interface Window {
    chrome: boolean;
    safari: boolean;
  }

  interface HTMLVideoElement {
    disablePictureInPicture: boolean;
    webkitEnterFullscreen(): Promise<void>;
    webkitSupportsPresentationMode(): boolean;
    webkitSetPresentationMode(mode: WebKitPresentationMode): Promise<void>;
  }
}

// V8ToIstanbul fails when no value is exported.
export default class {}
