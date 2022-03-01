// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-fullscreen-button';
import * as React from 'react';
import { createComponent } from './createComponent';
import { FullscreenButtonElement } from '../../ui/fullscreen-button';

const EVENTS = {} as const;

/** A button for toggling the fullscreen mode of the player.

💡 The following media attributes are applied:

- `media-fullscreen`: Applied when the media has entered fullscreen.

🚨 The `hidden` attribute will be present on this element in the event fullscreen cannot be
requested (no support). There are default styles for this by setting the `display` property to
`none`. Important to be aware of this and update it according to your needs. */
const FullscreenButton = createComponent(
  React,
  'vds-fullscreen-button',
  FullscreenButtonElement,
  EVENTS,
  'FullscreenButton'
);

export default FullscreenButton;
