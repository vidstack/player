import { loadScript } from '../utils/network';
import { isUndefined } from '../utils/unit';

type PendingLibRequest = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
};

const PENDING_LIB_REQUESTS: Record<string, PendingLibRequest[]> = {};

/**
 * Helper class that can download a third-party library into the document. The library should be
 * loaded into the global namespace (`Window`).
 */
export class LibLoader<LibType> {
  protected _lib?: LibType;

  get lib(): LibType | undefined {
    return this._lib;
  }

  constructor(
    /**
     * The URL where the library source code can be found and downloaded. Generally this
     * will point to a CDN such as `https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js`.
     */
    public src: string,
    /**
     * The name of the module the library is loaded under. This refers to the name
     * the library can be accessed within the global namespace, such as `window.Hls` or `window.YT`.
     */
    public readonly moduleName: string,
  ) {}

  /**
   * Begins downloading the current library from the specified `libSrc`. If
   * the library has already been downloaded, it's returned immediately.
   */
  async download(): Promise<LibType> {
    const existingModule = this.getModule(this.moduleName as keyof Window);

    if (!isUndefined(existingModule)) {
      return existingModule;
    }

    return new Promise<LibType>((resolve, reject) => {
      const pendingRequest = { resolve, reject };

      if (this.hasInitializedRequests()) {
        this.addPendingRequest(pendingRequest);
        return;
      }

      this.addPendingRequest(pendingRequest);
      this.loadLib();
    });
  }

  protected getModule(key: keyof Window): LibType | undefined {
    if (!isUndefined(window[key])) return window[key];

    if (window.exports && window.exports[key]) return window.exports[key];

    if (window.module && window.module.exports && window.module.exports[key]) {
      return window.module.exports[key];
    }

    return undefined;
  }

  protected hasInitializedRequests(): boolean {
    return !isUndefined(this.getPendingRequests());
  }

  protected addPendingRequest(request: PendingLibRequest): void {
    if (!this.hasInitializedRequests()) {
      PENDING_LIB_REQUESTS[this.src] = [];
    }

    this.getPendingRequests().push(request);
  }

  protected getPendingRequests(): PendingLibRequest[] {
    return PENDING_LIB_REQUESTS[this.src];
  }

  protected destroyPendingRequests(): void {
    delete PENDING_LIB_REQUESTS[this.src];
  }

  protected loadLib(): void {
    loadScript(
      this.src,
      this.handleLoadSuccess.bind(this),
      this.handleLoadFail.bind(this),
    );
  }

  protected handleLoadSuccess(): void {
    this._lib = this.getModule(this.moduleName as keyof Window) as LibType;
    this.getPendingRequests().forEach(request => request.resolve(this.lib));
  }

  protected handleLoadFail(event: unknown): void {
    this.getPendingRequests().forEach(request => request.reject(event));
    this.destroyPendingRequests();
  }
}
