import { defineCustomElement } from 'maverick.js/element';

import { MediaAudioLayoutElement } from '../../define/layouts/default/audio-layout-element';
import { MediaVideoLayoutElement } from '../../define/layouts/default/video-layout-element';
import { MediaPlyrLayoutElement } from '../../define/layouts/plyr/plyr-layout-element';

defineCustomElement(MediaAudioLayoutElement);
defineCustomElement(MediaVideoLayoutElement);
defineCustomElement(MediaPlyrLayoutElement);
