import { setAttribute } from '../../utils/dom';
import { isNumber, isString } from '../../utils/unit';
import { MediaStyleController } from './MediaStyleController';

class MediaAttrsController extends MediaStyleController {
  protected _handleValueChange(_, attrName: string, value: unknown) {
    setAttribute(
      this._host,
      attrName,
      isString(value) || isNumber(value) ? String(value) : !!value
    );
  }

  protected _handleDisconnect(_, attrName: string) {
    this._host.removeAttribute(attrName);
  }
}

export function bindMediaPropsToAttrs(
  ...params: ConstructorParameters<typeof MediaAttrsController>
) {
  return new MediaAttrsController(...params);
}
