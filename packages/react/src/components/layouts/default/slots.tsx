import * as React from 'react';

import { isUndefined, uppercaseFirstChar } from 'maverick.js/std';

import { DefaultLayoutContext } from './context';

export type SlotPositions<Name extends string> =
  | `before${Capitalize<Name>}`
  | Name
  | `after${Capitalize<Name>}`;

export type Slots<Names extends string> = {
  [slotName in SlotPositions<Names>]?: React.ReactNode;
};

export type DefaultLayoutSlotName =
  | 'bufferingIndicator'
  | 'captionButton'
  | 'captions'
  | 'chapterTitle'
  | 'currentTime'
  | 'endTime'
  | 'fullscreenButton'
  | 'liveButton'
  | 'livePlayButton'
  | 'muteButton'
  | 'pipButton'
  | 'playButton'
  | 'loadButton'
  | 'seekBackwardButton'
  | 'seekForwardButton'
  | 'startDuration'
  | 'timeSlider'
  | 'volumeSlider'
  | DefaultLayoutMenuSlotName;

export type DefaultLayoutMenuSlotName =
  | 'chaptersMenu'
  | 'settingsMenu'
  | 'settingsMenuStartItems'
  | 'settingsMenuEndItems';

export interface DefaultLayoutSlots extends Slots<DefaultLayoutSlotName> {}

export interface DefaultAudioLayoutSlots {
  smallLayout?: DefaultLayoutSlots;
  largeLayout?: DefaultLayoutSlots;
}

export interface DefaultVideoLayoutSlots {
  smallLayout?: DefaultLayoutSlots;
  largeLayout?: DefaultLayoutSlots;
}

export function useDefaultAudioLayoutSlots() {
  return React.useContext(DefaultLayoutContext).slots as DefaultAudioLayoutSlots | undefined;
}

export function useDefaultVideoLayoutSlots() {
  return React.useContext(DefaultLayoutContext).slots as DefaultVideoLayoutSlots | undefined;
}

export function slot<T>(
  slots: T | undefined,
  name: keyof T,
  defaultValue: React.ReactNode,
): React.ReactNode {
  const slot = slots?.[name],
    capitalizedName = uppercaseFirstChar(name as string);
  return (
    <>
      {slots?.[`before${capitalizedName}`]}
      {isUndefined(slot) ? defaultValue : slot}
      {slots?.[`after${capitalizedName}`]}
    </>
  );
}
