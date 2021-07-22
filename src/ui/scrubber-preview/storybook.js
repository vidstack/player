import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';

export const SCRUBBER_PREVIEW_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  noClamp: { control: StorybookControl.Boolean, defaultValue: false },
  noTrackFill: { control: StorybookControl.Boolean, defaultValue: false },
  // Actions
  onScrubberPreviewConnect: storybookAction('vds-scrubber-preview-connect'),
  onScrubberPreviewShow: storybookAction('vds-scrubber-preview-show'),
  onScrubberPreviewTimeUpdate: storybookAction(
    'vds-scrubber-preview-time-update'
  ),
  onScrubberPreviewHide: storybookAction('vds-scrubber-preview-hide')
};
