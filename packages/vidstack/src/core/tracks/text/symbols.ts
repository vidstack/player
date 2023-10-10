const CROSSORIGIN = Symbol(__DEV__ ? 'TEXT_TRACK_CROSSORIGIN' : 0),
  READY_STATE = Symbol(__DEV__ ? 'TEXT_TRACK_READY_STATE' : 0),
  UPDATE_ACTIVE_CUES = Symbol(__DEV__ ? 'TEXT_TRACK_UPDATE_ACTIVE_CUES' : 0),
  CAN_LOAD = Symbol(__DEV__ ? 'TEXT_TRACK_CAN_LOAD' : 0),
  ON_MODE_CHANGE = Symbol(__DEV__ ? 'TEXT_TRACK_ON_MODE_CHANGE' : 0),
  NATIVE = Symbol(__DEV__ ? 'TEXT_TRACK_NATIVE' : 0),
  NATIVE_HLS = Symbol(__DEV__ ? 'TEXT_TRACK_NATIVE_HLS' : 0);

export const TextTrackSymbol = {
  _crossorigin: CROSSORIGIN,
  _readyState: READY_STATE,
  _updateActiveCues: UPDATE_ACTIVE_CUES,
  _canLoad: CAN_LOAD,
  _onModeChange: ON_MODE_CHANGE,
  _native: NATIVE,
  _nativeHLS: NATIVE_HLS,
} as const;
