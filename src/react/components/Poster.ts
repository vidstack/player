// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-poster.ts';
import * as React from 'react';
import { createComponent } from './createComponent';
import { PosterElement } from '../../ui/poster';

const EVENTS = {} as const;

/** Loads and displays the current media poster image. By default, the media provider's
loading strategy is respected, otherwise you can specify `eager` or `lazy`.

💡 The following img attributes are applied:

- `img-loading`: When the poster image is in the process of being downloaded by the browser.
- `img-loaded`: When the poster image has successfully loaded.
- `img-error`: When the poster image has failed to load. */
const Poster = createComponent(
  React,
  'vds-poster',
  PosterElement,
  EVENTS,
  'Poster'
);

export default Poster;
