import { isNil, isNull, isNumber, isUndefined } from 'maverick.js/std';
import { Composition } from 'remotion';
import { NoReactInternals } from 'remotion/no-react';

import type { RemotionSrc } from './types';

export function validateRemotionResource({
  src,
  compositionWidth: width,
  compositionHeight: height,
  fps,
  durationInFrames,
  initialFrame,
  inFrame,
  outFrame,
  numberOfSharedAudioTags,
}: RemotionSrc) {
  if (!__DEV__) return;

  validateComponent(src);
  validateInitialFrame(initialFrame, durationInFrames);

  validateDimension(width, 'compositionWidth', 'of the remotion source');
  validateDimension(height, 'compositionHeight', 'of the remotion source');

  validateDurationInFrames(durationInFrames, {
    component: 'of the remotion source',
    allowFloats: false,
  });

  validateFps(fps, 'of the remotion source', false);

  validateInOutFrames(inFrame, outFrame, durationInFrames);
  validateSharedNumberOfAudioTags(numberOfSharedAudioTags);
}

export const validateFps: typeof NoReactInternals.validateFps = NoReactInternals.validateFps;

export const validateDimension: typeof NoReactInternals.validateDimension =
  NoReactInternals.validateDimension;

export const validateDurationInFrames: typeof NoReactInternals.validateDurationInFrames =
  NoReactInternals.validateDurationInFrames;

export function validateInitialFrame(initialFrame: number | undefined, frames: number) {
  if (!__DEV__) return;

  if (!isNumber(frames)) {
    throw new Error(
      `[vidstack] \`durationInFrames\` must be a number, but is ${JSON.stringify(frames)}`,
    );
  }

  if (isUndefined(initialFrame)) {
    return;
  }

  if (!isNumber(initialFrame)) {
    throw new Error(
      `[vidstack] \`initialFrame\` must be a number, but is ${JSON.stringify(initialFrame)}`,
    );
  }

  if (Number.isNaN(initialFrame)) {
    throw new Error(`[vidstack] \`initialFrame\` must be a number, but is NaN`);
  }

  if (!Number.isFinite(initialFrame)) {
    throw new Error(`[vidstack] \`initialFrame\` must be a number, but is Infinity`);
  }

  if (initialFrame % 1 !== 0) {
    throw new Error(
      `[vidstack] \`initialFrame\` must be an integer, but is ${JSON.stringify(initialFrame)}`,
    );
  }

  if (initialFrame > frames - 1) {
    throw new Error(
      `[vidstack] \`initialFrame\` must be less or equal than \`durationInFrames - 1\`, but is ${JSON.stringify(
        initialFrame,
      )}`,
    );
  }
}

export function validateSingleFrame(frame: unknown, variableName: string): number | null {
  if (!__DEV__) return frame as number;

  if (isNil(frame)) {
    return frame ?? null;
  }

  if (!isNumber(frame)) {
    throw new TypeError(
      `[vidstack] \`${variableName}\` must be a number, but is ${JSON.stringify(frame)}`,
    );
  }

  if (Number.isNaN(frame)) {
    throw new TypeError(
      `[vidstack] \`${variableName}\` must not be NaN, but is ${JSON.stringify(frame)}`,
    );
  }

  if (!Number.isFinite(frame)) {
    throw new TypeError(
      `[vidstack] \`${variableName}\` must be finite, but is ${JSON.stringify(frame)}`,
    );
  }

  if (frame % 1 !== 0) {
    throw new TypeError(
      `[vidstack] \`${variableName}\` must be an integer, but is ${JSON.stringify(frame)}`,
    );
  }

  return frame;
}

export function validateInOutFrames(
  inFrame: number | undefined | null,
  outFrame: number | undefined | null,
  frames: number,
) {
  if (!__DEV__) return;

  const validatedInFrame = validateSingleFrame(inFrame, 'inFrame'),
    validatedOutFrame = validateSingleFrame(outFrame, 'outFrame');

  if (isNull(validatedInFrame) && isNull(validatedOutFrame)) {
    return;
  }

  // Must not be over the duration
  if (!isNull(validatedInFrame) && validatedInFrame > frames - 1) {
    throw new Error(
      `[vidstack] \`inFrame\` must be less than (durationInFrames - 1), but is \`${validatedInFrame}\``,
    );
  }

  if (!isNull(validatedOutFrame) && validatedOutFrame > frames) {
    throw new Error(
      `[vidstack] \`outFrame\` must be less than (durationInFrames), but is \`${validatedOutFrame}\``,
    );
  }

  // Must not be under 0
  if (!isNull(validatedInFrame) && validatedInFrame < 0) {
    throw new Error(
      `[vidstack] \`inFrame\` must be greater than 0, but is \`${validatedInFrame}\``,
    );
  }

  if (!isNull(validatedOutFrame) && validatedOutFrame <= 0) {
    throw new Error(
      `[vidstack] \`outFrame\` must be greater than 0, but is \`${validatedOutFrame}\`. If you want to render a single frame, use \`<RemotionThumbnail />\` instead.`,
    );
  }

  if (
    !isNull(validatedOutFrame) &&
    !isNull(validatedInFrame) &&
    validatedOutFrame <= validatedInFrame
  ) {
    throw new Error(
      '[vidstack] `outFrame` must be greater than `inFrame`, but is ' +
        validatedOutFrame +
        ' <= ' +
        validatedInFrame,
    );
  }
}

export function validateSharedNumberOfAudioTags(tags: number | undefined) {
  if (!__DEV__ || isUndefined(tags)) return;

  if (tags % 1 !== 0 || !Number.isFinite(tags) || Number.isNaN(tags) || tags < 0) {
    throw new TypeError(
      `[vidstack] \`numberOfSharedAudioTags\` must be an integer but got \`${tags}\` instead`,
    );
  }
}

export function validatePlaybackRate(playbackRate: number) {
  if (!__DEV__) return;

  if (playbackRate > 4) {
    throw new Error(
      `[vidstack] The highest possible playback rate with Remotion is 4. You passed: ${playbackRate}`,
    );
  }

  if (playbackRate < -4) {
    throw new Error(
      `[vidstack] The lowest possible playback rate with Remotion is -4. You passed: ${playbackRate}`,
    );
  }

  if (playbackRate === 0) {
    throw new Error(`[vidstack] A playback rate of 0 is not supported.`);
  }
}

export function validateComponent(src: RemotionSrc['src']) {
  if (!__DEV__) return;

  // @ts-expect-error
  if (src.type === Composition) {
    throw new TypeError(
      `[vidstack] \`src\` should not be an instance of \`<Composition/>\`. Pass the React component directly, and set the duration, fps and dimensions as source props.`,
    );
  }

  if (src === Composition) {
    throw new TypeError(
      `[vidstack] \`src\` must not be the \`Composition\` component. Pass your own React component directly, and set the duration, fps and dimensions as source props.`,
    );
  }
}
