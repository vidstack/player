import type { StaticLoader } from '@vessel-js/app/server';

export const staticLoader: StaticLoader = ({ params }) => {
  return {
    redirect: {
      path: `docs${params.lib ? `/${params.lib}` : ''}/player/getting-started/installation`,
      status: 302,
    },
  };
};
