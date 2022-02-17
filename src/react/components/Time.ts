// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-time.ts';
import * as React from 'react';
import { createComponent } from './createComponent';
import { TimeElement } from '../../ui/time';

const EVENTS = {} as const;

/** Outputs a media duration (eg: `currentTime`, `duration`, `bufferedAmount`, etc.) value as time
formatted text. */
const Time = createComponent(React, 'vds-time', TimeElement, EVENTS, 'Time');

export default Time;
