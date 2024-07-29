export const SET_AUTO = Symbol(__DEV__ ? 'SET_AUTO_QUALITY' : 0),
  ENABLE_AUTO = Symbol(__DEV__ ? 'ENABLE_AUTO_QUALITY' : 0);

/** @internal */
export const QualitySymbol = {
  setAuto: SET_AUTO,
  enableAuto: ENABLE_AUTO,
} as const;
