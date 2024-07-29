const ADD = Symbol(__DEV__ ? 'LIST_ADD' : 0),
  REMOVE = Symbol(__DEV__ ? 'LIST_REMOVE' : 0),
  RESET = Symbol(__DEV__ ? 'LIST_RESET' : 0),
  SELECT = Symbol(__DEV__ ? 'LIST_SELECT' : 0),
  READONLY = Symbol(__DEV__ ? 'LIST_READONLY' : 0),
  SET_READONLY = Symbol(__DEV__ ? 'LIST_SET_READONLY' : 0),
  ON_RESET = Symbol(__DEV__ ? 'LIST_ON_RESET' : 0),
  ON_REMOVE = Symbol(__DEV__ ? 'LIST_ON_REMOVE' : 0),
  ON_USER_SELECT = Symbol(__DEV__ ? 'LIST_ON_USER_SELECT' : 0);

/** @internal */
export const ListSymbol = {
  add: ADD,
  remove: REMOVE,
  reset: RESET,
  select: SELECT,
  readonly: READONLY,
  setReadonly: SET_READONLY,
  onReset: ON_RESET,
  onRemove: ON_REMOVE,
  onUserSelect: ON_USER_SELECT,
} as const;
