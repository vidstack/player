import 'lit/experimental-hydrate-support.js';

import { hydrateShadowRoots } from '@webcomponents/template-shadowroot';

const supportsDeclarativeShadowDOM = Object.hasOwnProperty.call(
  HTMLTemplateElement.prototype,
  'shadowRoot',
);

if (!supportsDeclarativeShadowDOM) {
  hydrateShadowRoots(document.body);
}
