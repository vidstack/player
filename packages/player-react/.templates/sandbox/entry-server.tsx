import { renderToString } from 'react-dom/server';

import Player from './Player';

export function render() {
  return renderToString(<Player />);
}
