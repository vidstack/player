// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-media-controller.ts';
import * as React from 'react';
import { createComponent } from './createComponent';
import { MediaControllerElement } from '../../media/controller';

const EVENTS = {} as const;

/** The media controller acts as a message bus between the media provider and all other
components, such as UI components and plugins. The main responsibilities are:

- Provide the media context that is used to pass media state down to components (this
context is injected into and managed by the media provider).

- Listen for media request events and fulfill them by calling the appropriate props/methods on
the current media provider.

💡 The base `MediaPlayer` acts as both a media controller and provider. */
const MediaController = createComponent(
  React,
  'vds-media-controller',
  MediaControllerElement,
  EVENTS,
  'MediaController'
);

export default MediaController;
