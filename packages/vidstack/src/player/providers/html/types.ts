import type { HTMLCustomElement } from 'maverick.js/element';

import type { MediaProviderEvents, MediaProviderMembers } from '../../media/provider/types';
import type { HtmlMediaElementProps } from './props';

export interface HtmlMediaProviderElement
  extends HTMLCustomElement<HtmlMediaElementProps, MediaProviderEvents>,
    // Members
    HtmlMediaElementProps,
    MediaProviderMembers {}
