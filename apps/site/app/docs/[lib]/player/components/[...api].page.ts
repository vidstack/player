import type { StaticLoader } from '@vessel-js/app/server';

export const staticLoader: StaticLoader = ({ pathname }) => {
  return {
    redirect: {
      path: pathname.replace('/api', '') + '#component_api',
      status: 301,
    },
  };
};
