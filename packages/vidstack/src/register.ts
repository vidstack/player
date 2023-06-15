import { registerLiteCustomElement } from 'maverick.js/element';

import { Outlet } from './player/outlet/outlet';
import { Player } from './player/player';
import { CommunitySkin } from './player/skins/community/skin';
import { getUIComponents } from './register-ui';

export default function registerAllElements(): void {
  [Player, Outlet, ...getUIComponents(), CommunitySkin].map(registerLiteCustomElement);
}
