export type Constructor<T = Record<string, unknown>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  prototype: T;
};

export type Callback<T> = (value: T) => void;

export type Unsubscribe = () => void;

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
