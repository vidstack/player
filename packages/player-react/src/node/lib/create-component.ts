/**
 * Adapted from https://github.com/lit/lit/blob/main/packages/labs/react/src/create-component.ts.
 */

import { camelToKebabCase } from '@vidstack/foundation';
import { execSync } from 'child_process';
import path from 'path';
import * as ReactModule from 'react';
import { renderToString } from 'react-dom/server';
import { fileURLToPath } from 'url';

let ssrInProgress = false;

const tags = new Set<string>();
const blacklist = new Set(['children', 'localName', 'ref', 'style', 'className']);

const ssrFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), './exec-ssr.js');

const camelCaseRE = /[a-z][A-Z]/g;

export const createComponent = (
  React: typeof ReactModule,
  tagName: string,
  { skipSSR = false } = {},
) => {
  const Component = React.Component;
  const createElement = React.createElement;

  class ReactComponent extends Component {
    override render() {
      tags.add(tagName);

      const props: any = { ...this.props };
      delete props.__forwardedRef;

      for (const prop of Object.keys(props)) {
        if (prop.startsWith('_') || blacklist.has(prop) || typeof props[prop] === 'function') {
          continue;
        }

        if (typeof props[prop] === 'object') {
          props[prop] = JSON.stringify(props[prop]);
        }

        if (camelCaseRE.test(prop)) {
          props[camelToKebabCase(prop)] = props[prop];
          delete props[prop];
        }
      }

      if (!ssrInProgress && !skipSSR) {
        ssrInProgress = true;

        const openTag = `<${tagName}>`;
        const closeTag = `</${tagName}>`;
        const html = `${openTag}${renderToString(props.children)}${closeTag}`;

        try {
          const ssrResult = execSync(
            `node --unhandled-rejections=strict --abort-on-uncaught-exception ${ssrFile}`,
            {
              env: { ...process.env, html, tagNames: JSON.stringify(Array.from(tags)) },
            },
          ).toString();

          props.dangerouslySetInnerHTML = {
            __html: ssrResult.slice(openTag.length, -closeTag.length),
          };

          delete props.children;
        } catch (e) {
          console.error(e);
        }

        ssrInProgress = false;
      }

      return createElement(tagName, props);
    }
  }

  const ForwardedComponent = React.forwardRef<any, any>((props, ref) =>
    createElement(ReactComponent, { ...props, __forwardedRef: ref }, props?.children),
  );

  return ForwardedComponent;
};
