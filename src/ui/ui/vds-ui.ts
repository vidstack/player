import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { Ui } from './Ui';

export const UI_TAG_NAME = `${LIB_PREFIX}-ui`;

safelyDefineCustomElement(UI_TAG_NAME, Ui);

declare global {
  interface HTMLElementTagNameMap {
    'vds-ui': Ui;
  }
}
