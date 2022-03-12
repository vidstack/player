/**
 * Indicates the current state of the fetching of media over the network.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/networkState
 */
export enum MediaNetworkState {
  /**
   * There is no data yet. Also, `readyState` is `HaveNothing`.
   */
  Empty = 0,

  /**
   * Provider is active and has selected a resource, but is not using the network.
   */
  Idle = 1,

  /**
   * The browser is downloading data.
   */
  Loading = 2,

  /**
   * No source has been found.
   */
  NoSource = 3,
}
