import { effect, peek, signal } from 'maverick.js';
import { isString, listenEvent } from 'maverick.js/std';

import { appendParamsToURL } from '../../utils/network';

export abstract class EmbedProvider<Message> {
  #iframe: HTMLIFrameElement;

  protected abstract getOrigin(): string;
  protected abstract buildParams(): Record<string, any>;
  protected abstract onMessage(message: Message, event: MessageEvent): void;
  protected abstract onLoad(): void;

  protected src = signal('');

  /**
   * Defines which referrer is sent when fetching the resource.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/referrerPolicy}
   */
  referrerPolicy: ReferrerPolicy | null = null;

  get iframe() {
    return this.#iframe;
  }

  constructor(iframe: HTMLIFrameElement) {
    this.#iframe = iframe;

    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('aria-hidden', 'true');

    iframe.setAttribute(
      'allow',
      'autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope',
    );

    if (this.referrerPolicy !== null) {
      iframe.setAttribute('referrerpolicy', this.referrerPolicy);
    }
  }

  setup() {
    listenEvent(window, 'message' as any, this.#onWindowMessage.bind(this) as any);
    listenEvent(this.#iframe, 'load', this.onLoad.bind(this));
    effect(this.#watchSrc.bind(this));
  }

  #watchSrc() {
    const src = this.src();

    if (!src.length) {
      this.#iframe.setAttribute('src', '');
      return;
    }

    const params = peek(() => this.buildParams());
    this.#iframe.setAttribute('src', appendParamsToURL(src, params));
  }

  postMessage(message: any, target?: string) {
    if (__SERVER__) return;
    this.#iframe.contentWindow?.postMessage(JSON.stringify(message), target ?? '*');
  }

  #onWindowMessage(event: MessageEvent) {
    const origin = this.getOrigin(),
      isOriginMatch =
        (event.source === null || event.source === this.#iframe?.contentWindow) &&
        (!isString(origin) || origin === event.origin);

    if (!isOriginMatch) return;

    try {
      const message = JSON.parse(event.data);
      if (message) this.onMessage(message, event);
      return;
    } catch (e) {
      // no-op
    }

    if (event.data) this.onMessage(event.data, event);
  }
}
