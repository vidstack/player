import { redirect } from '@vessel-js/app/http';
import type { ServerLoader } from '@vessel-js/app/server';

export const EDGE = true;

/**
 * React pages were previously located at `docs/player/react/*`. Framework integrations
 * are now listed before the product so we need to redirect to `docs/react/player/*`.
 */
export const serverLoader: ServerLoader = ({ request }) => {
  throw redirect(request.URL.href.replace('docs/player/react', 'docs/react/player'), 301);
};
