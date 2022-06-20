import '@vidstack/player/hydrate.js';

import { hydrateRoot } from 'react-dom/client';

import Player from './Player';

hydrateRoot(document.getElementById('app')!, <Player />);
