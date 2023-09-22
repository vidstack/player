/* @refresh reload */
import { render } from 'solid-js/web';

import { Player } from './player';

const root = document.getElementById('player');
render(() => <Player />, root!);
