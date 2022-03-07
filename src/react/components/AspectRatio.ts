// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-aspect-ratio';
import * as React from 'react';
import { createComponent } from './createComponent';
import { AspectRatioElement } from '../../ui/aspect-ratio';

const EVENTS = {} as const;

/** This element creates a container that will hold the dimensions of the desired aspect ratio. This
container is useful for reserving space for media as it loads over the network.

💡  If your browser matrix supports the
[`aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) CSS property
then you can skip using this component, and set the desired aspect ratio directly on the
provider.

💡 By default it respects the browser's default aspect-ratio for media. This is not specific
to the loaded media but instead a general setting of `2/1`. */
const AspectRatio = createComponent(
  React,
  'vds-aspect-ratio',
  AspectRatioElement,
  EVENTS,
  'AspectRatio'
);

export default AspectRatio;
