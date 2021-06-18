import { safelyDefineCustomElement } from '../../../utils/dom';
import { ToggleElement, VDS_TOGGLE_ELEMENT_TAG_NAME } from './ToggleElement';

safelyDefineCustomElement(VDS_TOGGLE_ELEMENT_TAG_NAME, ToggleElement);
