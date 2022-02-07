import type { ReactiveControllerHost } from 'lit';

import { DisposalBin } from '../../base/events';
import { LogDispatcher } from '../../base/logger';
import { derived, ReadableStore } from '../../base/stores';
import { isNumber, isString } from '../../utils/unit';
import { mediaStoreContext } from '../mediaStore';

export class MediaTextController {
  protected _template?: string;
  protected _disposal = new DisposalBin();
  protected _logger = __DEV__ ? new LogDispatcher(this._host) : undefined;

  protected readonly _mediaStoreConsumer: ReturnType<
    typeof mediaStoreContext['consume']
  >;

  get template() {
    return this._template;
  }

  set template(newTemplate) {
    if (this._template !== newTemplate) {
      this._template = newTemplate;
      this._handleTemplateChange();
    }
  }

  constructor(
    protected readonly _host: ReactiveControllerHost & EventTarget,
    protected readonly _callback: (text: string | null) => void
  ) {
    this._mediaStoreConsumer = mediaStoreContext.consume(_host);

    _host.addController({
      hostDisconnected: this._hostDisconnected.bind(this)
    });
  }

  protected _hostDisconnected() {
    this._destroy();
  }

  protected _destroy() {
    this._disposal.empty();
    this._callback(null);
  }

  protected _handleTemplateChange() {
    this._destroy();

    if (!isString(this.template)) return;

    const mediaProps = this.template.split(/(?:\+|-|\*|\/)/);

    if (mediaProps[0] === '' || !this._validateMediaProps(mediaProps)) return;

    const stores: ReadableStore<string | number>[] = [];

    for (const mediaProp of mediaProps) {
      const store = this._mediaStoreConsumer.value[mediaProp];
      if (store) stores.push(store as ReadableStore<string | number>);
    }

    // A store was missing (invalid media property) - prod check.
    if (stores.length !== mediaProps.length) return;

    const unsub = derived(stores, ($values) => $values).subscribe(($values) => {
      this._handleTextChange(mediaProps, $values);
    });

    this._disposal.add(unsub);
  }

  protected _validateMediaProps(mediaProps: string[]) {
    if (__DEV__) {
      const invalidMediaProps = mediaProps.filter((mediaProp) => {
        const store = this._mediaStoreConsumer.value[mediaProp];
        return (
          !store ||
          (!isString(store.initialValue) && !isNumber(store.initialValue))
        );
      });

      if (invalidMediaProps.length > 0) {
        this._logger
          ?.warnGroup('Invalid media properties found inside media text.')
          .labelledLog('Host', this._host)
          .labelledLog('Value', this._template)
          .labelledLog('Invalid Props', invalidMediaProps)
          .dispatch();

        return false;
      }
    }

    return true;
  }

  protected _handleTextChange(
    mediaProps: string[],
    values: (string | number)[]
  ) {
    // Replace each media property in string with it's current value.
    const text = mediaProps.reduce(
      (str, mediaProp, index) => str.replace(mediaProp, `${values[index]}`),
      this.template ?? ''
    );

    // Strip out anything that isn't an arithmetic operator or digit.
    const sanitizedText = text.replace(/[^-/*+\d]/g, '');

    const evaluatedText = eval(sanitizedText);

    this._callback(`${evaluatedText}`);
  }
}
