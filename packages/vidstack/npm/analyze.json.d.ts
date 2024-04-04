import type { ComponentMeta, CustomElementMeta } from '@maverick-js/cli/analyze';

declare const json: {
  elements: CustomElementMeta[];
  components: ComponentMeta[];
};

export default json;
