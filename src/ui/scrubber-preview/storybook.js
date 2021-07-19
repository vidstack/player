import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import {
  ScrubberPreviewHideEvent,
  ScrubberPreviewShowEvent,
  ScrubberPreviewTimeUpdateEvent
} from './events.js';
import { ScrubberPreviewConnectEvent } from './ScrubberPreviewElement.js';

export const SCRUBBER_PREVIEW_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  noClamp: { control: StorybookControl.Boolean, defaultValue: false },
  noTrackFill: { control: StorybookControl.Boolean, defaultValue: false },
  // Actions
  onScrubberPreviewConnect: storybookAction(ScrubberPreviewConnectEvent.TYPE),
  onScrubberPreviewShow: storybookAction(ScrubberPreviewShowEvent.TYPE),
  onScrubberPreviewTimeUpdate: storybookAction(
    ScrubberPreviewTimeUpdateEvent.TYPE
  ),
  onScrubberPreviewHide: storybookAction(ScrubberPreviewHideEvent.TYPE)
};
