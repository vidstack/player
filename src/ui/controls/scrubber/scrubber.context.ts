import createContext from '@wcom/context';

export const scrubberPreviewContext = {
  time: createContext(0),
  hidden: createContext(true),
};
