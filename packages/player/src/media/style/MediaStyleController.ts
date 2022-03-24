import { camelToKebabCase, DisposalBin } from '@vidstack/foundation';
import { type ReactiveElement } from 'lit';

import { type MediaContext } from '../MediaContext';
import { type ReadableMediaStoreRecord } from '../store';

export abstract class MediaStyleController {
  protected _disposal = new DisposalBin();

  constructor(
    protected readonly _host: ReactiveElement,
    protected readonly _store: ReadableMediaStoreRecord,
    protected readonly _mediaProps: (keyof MediaContext)[],
  ) {
    this._host.addController({
      hostConnected: this._hostConnected.bind(this),
      hostDisconnected: this._hostDisconnected.bind(this),
    });
  }

  protected _hostConnected() {
    const idleCallback = window.requestIdleCallback ?? ((cb: () => void) => cb());

    idleCallback(() => {
      for (const propName of this._mediaProps) {
        const store = this._store[propName];

        if (store) {
          const attrName = this._getMediaAttrName(propName);

          const unsub = store.subscribe(($v) => {
            window.requestAnimationFrame(() => {
              this._handleValueChange(propName, attrName, $v);
            });
          });

          this._disposal.add(unsub);
        }
      }
    });
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
