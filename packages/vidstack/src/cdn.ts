import { registerLiteCustomElement } from 'maverick.js/element';

import { Icon } from './icons/component';
import registerAllElements from './register';

registerAllElements();
registerLiteCustomElement(Icon);
