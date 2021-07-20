/**
 * @typedef {import('lit').ReactiveElement} IdleObserverHost
 */
/**
 * Tracks user activity and determines when they are idle/inactive. Elements can dispatch requests
 * to pause/resume tracking idle state.
 */
export class IdleObserver {
    /**
     * @param {IdleObserverHost} host
     */
    constructor(host: IdleObserverHost);
    /**
     * @protected
     * @readonly
     * @type {IdleObserverHost}
     */
    protected readonly host: IdleObserverHost;
    /**
     * @protected
     * @readonly
     */
    protected readonly idle: import("../../bundle/index.js").ContextProvider<boolean>;
    /**
     * Prevent an `idle` state occurring.
     *
     * @protected
     * @type {boolean}
     */
    protected preventIdling: boolean;
    /**
     * The amount of time in `ms` to pass before considering the user to be idle.
     *
     * @type {number}
     */
    timeout: number;
    /**
     * Whether there has been no user activity for the given `timeout` period or greater.
     *
     * @type {boolean}
     */
    get isIdle(): boolean;
    /**
     * @protected
     * @param {Event} [request]
     */
    protected handleUserInteraction(request?: Event | undefined): void;
    /**
     * @protected
     * @type {number}
     */
    protected timeoutId: number;
    /**
     * Start tracking idle state. If `pause` is called this method will do nothing until `resume`
     * is called.
     *
     * @param {Event} [request]
     */
    start(request?: Event | undefined): void;
    /**
     * Enables tracking idle state to resume.
     *
     * @param {Event} [request]
     */
    resume(request?: Event | undefined): void;
    /**
     * Pause tracking idle state. Prevents further idle states to occur until `resume` is called.
     *
     * @param {Event} [request]
     */
    pause(request?: Event | undefined): void;
    /**
     * Stop idling.
     *
     * @param {Event} [request]
     */
    stop(request?: Event | undefined): void;
    /**
     * @private
     * @type {boolean}
     */
    private prevIdleValue;
    /**
     * @protected
     * @param {Event} [request]
     */
    protected handleIdleChange(request?: Event | undefined): void;
    /**
     * @protected
     * @param {Event} request
     */
    protected handlePauseIdleTracking(request: Event): void;
    /**
     * @protected
     * @param {Event} request
     */
    protected handleResumeIdleTracking(request: Event): void;
}
export type IdleObserverHost = import('lit').ReactiveElement;
