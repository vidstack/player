import { camelToKebabCase, DisposalBin } from '@vidstack/foundation';
import type { ReactiveControllerHost } from 'lit';

import type { MediaContext } from '../MediaContext.js';
import { mediaStoreContext } from '../store.js';

export abstract class MediaStyleController {
  protected _disposal = new DisposalBin();
  protected _consumer: ReturnType<typeof mediaStoreContext['consume']>;

  constructor(
    protected readonly _host: ReactiveControllerHost & HTMLElement,
    protected readonly _mediaProps: (keyof MediaContext)[],
  ) {
    this._consumer = mediaStoreContext.consume(_host);

    _host.addController({
      hostConnected: this._hostConnected.bind(this),
      hostDisconnected: this._hostDisconnected.bind(this),
    });
  }

  protected _hostConnected() {
    for (const propName of this._mediaProps) {
      const store = this._consumer.value[propName];

      if (store) {
        const attrName = this._getMediaAttrName(propName);

        const unsub = store.subscribe(($v) => {
          this._handleValueChange(propName, attrName, $v);
        });

        this._disposal.add(unsub);
      }
    }
  }

  protected _hostDisconnected() {
    for (const propName of this._mediaProps) {
      this._handleDisconnect(propName, this._getMediaAttrName(propName));
    }

    this._disposal.empty();
  }

  protected _getMediaAttrName(propName: string) {
    // Replacing `media` because we don't want stuff like `media-media-type`.
    return `media-${camelToKebabCase(propName.replace('media', ''))}`;
  }

  protected abstract _handleValueChange(propName: string, attrName: string, value: unknown);

  protected abstract _handleDisconnect(propName: string, attrName: string);
}
