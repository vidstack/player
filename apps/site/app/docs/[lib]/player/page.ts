import { redirect } from '@vessel-js/app/http';
import type { ServerLoader } from '@vessel-js/app/server';

export const EDGE = true;

export const serverLoader: ServerLoader = ({ request }) => {
  throw redirect(request.URL.pathname + '/getting-started/quickstart', 302);
};
