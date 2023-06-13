import type { StaticLoader } from '@vessel-js/app/server';

export const staticLoader: StaticLoader = ({ pathname }) => {
  return {
    redirect: {
      // /styling/* -> /core-concepts/*
      path: pathname.replace('/styling', '/core-concepts').replace('/foundation', '/styling'),
      status: 301,
    },
  };
};
