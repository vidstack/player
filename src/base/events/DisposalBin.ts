import { ReactiveControllerHost } from 'lit';

import { DEV_MODE } from '../../env';
import { Logger } from '../logger';

export interface DisposalBinOptions {
  /**
   * Provide a name for debugging purposes.
   */
  name?: string;
  /**
   * Provide the owner of this queue for debugging purposes.
   */
  owner?: any;
}

/**
 * A disposal bin used to add cleanup callbacks that can be called when required.
 */

export class DisposalBin {
  // @ts-expect-error
  protected _disposal: (() => void)[] = this._disposal ?? [];

  protected _logger?: Logger;

  get name() {
    return this._options.name;
  }

  constructor(
    _host?: ReactiveControllerHost,
    protected readonly _options: DisposalBinOptions = {}
  ) {
    /* c8 ignore start */
    if (DEV_MODE && _host && _options.name) {
      const className = _options.owner ? ` [${this.constructor.name}]` : '';
      this._logger = new Logger(_host, {
        owner: _options.owner ?? this,
        name: `🗑️ ${this.name}${className}`
      });
    }
    /* c8 ignore stop */
  }

  add(callback?: () => void) {
    if (callback) this._disposal.push(callback);
  }

  /**
   * Dispose of callbacks.
   */
  empty() {
    /* c8 ignore start */
    if (DEV_MODE && this.name && this._disposal.length > 0) {
      this._logger?.info('empty', this._disposal.length, 'items');
    }
    /* c8 ignore stop */

    this._disposal.forEach((fn) => fn());
    this._disposal = [];
  }
}
