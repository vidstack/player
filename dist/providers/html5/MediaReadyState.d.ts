/**
 * *
 */
export type MediaReadyState = number;
export namespace MediaReadyState {
    const HaveNothing: number;
    const HaveMetadata: number;
    const HaveCurrentData: number;
    const HaveFutureData: number;
    const HaveEnoughData: number;
}
