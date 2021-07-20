/**
 * @returns {import('../foundation/context/types').ContextProviderRecord<typeof mediaContext>}
 */
export function createMediaContextRecord(): import('../foundation/context/types').ContextProviderRecord<typeof mediaContext>;
export namespace mediaContext {
    export const autoplay: import("../foundation/context/types").Context<boolean>;
    export { buffered };
    export { duration };
    export const bufferedAmount: import("../foundation/context/types").DerivedContext<number>;
    export const canRequestFullscreen: import("../foundation/context/types").Context<boolean>;
    export const canPlay: import("../foundation/context/types").Context<boolean>;
    export const canPlayThrough: import("../foundation/context/types").Context<boolean>;
    export const controls: import("../foundation/context/types").Context<boolean>;
    export const currentPoster: import("../foundation/context/types").Context<string>;
    export const currentSrc: import("../foundation/context/types").Context<string>;
    export const currentTime: import("../foundation/context/types").Context<number>;
    export const ended: import("../foundation/context/types").Context<boolean>;
    export const error: import('../foundation/context/types').Context<unknown | undefined>;
    export const fullscreen: import("../foundation/context/types").Context<boolean>;
    export const loop: import("../foundation/context/types").Context<boolean>;
    export const live: import("../foundation/context/types").DerivedContext<boolean>;
    export { mediaType };
    export const isAudio: import("../foundation/context/types").DerivedContext<boolean>;
    export const isVideo: import("../foundation/context/types").DerivedContext<boolean>;
    export { isLiveVideo };
    export const muted: import("../foundation/context/types").Context<boolean>;
    export const paused: import("../foundation/context/types").Context<boolean>;
    export const played: import("../foundation/context/types").Context<TimeRanges>;
    export const playing: import("../foundation/context/types").Context<boolean>;
    export const playsinline: import("../foundation/context/types").Context<boolean>;
    export { seekable };
    export const seekableAmount: import("../foundation/context/types").DerivedContext<number>;
    export const seeking: import("../foundation/context/types").Context<boolean>;
    export const started: import("../foundation/context/types").Context<boolean>;
    export { viewType };
    export const isAudioView: import("../foundation/context/types").DerivedContext<boolean>;
    export const isVideoView: import("../foundation/context/types").DerivedContext<boolean>;
    export const volume: import("../foundation/context/types").Context<number>;
    export const waiting: import("../foundation/context/types").Context<boolean>;
}
declare const buffered: import("../foundation/context/types").Context<TimeRanges>;
declare const duration: import("../foundation/context/types").Context<number>;
declare const mediaType: import("../foundation/context/types").Context<string>;
declare const isLiveVideo: import("../foundation/context/types").DerivedContext<boolean>;
declare const seekable: import("../foundation/context/types").Context<TimeRanges>;
declare const viewType: import("../foundation/context/types").Context<string>;
export {};
