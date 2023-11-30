import { effect, peek, signal } from 'maverick.js';
import { isString, listenEvent } from 'maverick.js/std';

import { appendParamsToURL } from '../../utils/network';
import type { MediaSetupContext } from '../types';

export abstract class EmbedProvider<Message> {
  protected _src = signal('');

  protected abstract _getOrigin(): string;
  protected abstract _buildParams(): Record<string, any>;
  protected abstract _onMessage(message: Message, event: MessageEvent): void;
  protected abstract _onLoad(): void;

  /**
   * Defines which referrer is sent when fetching the resource.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/referrerPolicy}
   */
  referrerPolicy: ReferrerPolicy | null = null;

  get iframe() {
    return this._iframe;
  }

  constructor(protected readonly _iframe: HTMLIFrameElement) {
    _iframe.setAttribute('frameBorder', '0');

    _iframe.setAttribute(
      'allow',
      'autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope',
    );

    if (this.referrerPolicy !== null) {
      _iframe.setAttribute('referrerpolicy', this.referrerPolicy);
    }
  }

  setup(ctx: MediaSetupContext) {
    effect(this._watchSrc.bind(this));
    listenEvent(window, 'message' as any, this._onWindowMessage.bind(this) as any);
    listenEvent(this._iframe, 'load', this._onLoad.bind(this));
  }

  protected _watchSrc() {
    const src = this._src();

    if (!src.length) {
      this._iframe.setAttribute('src', '');
      return;
    }

    const params = peek(() => this._buildParams());
    this._iframe.setAttribute('src', appendParamsToURL(src, params));
  }

  protected _postMessage(message: any, target?: string) {
    this._iframe.contentWindow?.postMessage(JSON.stringify(message), target ?? '*');
  }

  protected _onWindowMessage(event: MessageEvent) {
    const origin = this._getOrigin(),
      isOriginMatch =
        event.source === this._iframe?.contentWindow &&
        (!isString(origin) || origin === event.origin);

    if (!isOriginMatch) return;

    try {
      const message = JSON.parse(event.data);
      if (message) this._onMessage(message, event);
      return;
    } catch (e) {
      // no-op
    }

    if (event.data) this._onMessage(event.data, event);
  }
}
