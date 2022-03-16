import { isNumber, isString } from '@vidstack/foundation';

import { MediaStyleController } from './MediaStyleController';

class MediaCssPropsController extends MediaStyleController {
  protected _handleValueChange(_, attrName: string, value: unknown) {
    this._host.style.setProperty(
      this._getCssPropName(attrName),
      isString(value) || isNumber(value) ? String(value) : null,
    );
  }

  protected _getCssPropName(attrName: string) {
    return `--vds-${attrName}`;
  }

  protected _handleDisconnect(_, attrName: string) {
    this._host.style.setProperty(this._getCssPropName(attrName), null);
  }
}

export function bindMediaPropsToCssProps(
  ...params: ConstructorParameters<typeof MediaCssPropsController>
) {
  return new MediaCssPropsController(...params);
}
