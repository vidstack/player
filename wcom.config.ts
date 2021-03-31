/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ComponentMeta,
  EventMeta,
  litPlugin,
  markdownPlugin,
  Plugin,
  vscodePlugin,
} from '@wcom/cli';
import {
  escapeQuotes,
  getDocTags,
  getDocumentation,
  getPropTypeInfo,
  getTypeSourceFile,
  hasDocTag,
  isUndefined,
  traverseHeritageTree,
} from '@wcom/cli/dist/utils';
import prettier from 'prettier';
import {
  CallExpression,
  ClassDeclaration,
  Declaration,
  ImportSpecifier,
  isImportDeclaration,
  isInterfaceDeclaration,
  NamedImports,
  PropertySignature,
  StringLiteral,
  TypeChecker,
} from 'typescript';

export default [
  litPlugin(),
  eventDiscoveryPlugin(),
  dependencyDiscoveryPlugin(),
  storybookPlugin(),
  markdownPlugin({
    async transformContent(_, content) {
      return prettier.format(content, {
        arrowParens: 'avoid',
        parser: 'markdown',
        singleQuote: true,
        trailingComma: 'all',
      });
    },
  }),
  vscodePlugin(),
];

// -------------------------------------------------------------------------------------------
// Event Discovery Plugin
// -------------------------------------------------------------------------------------------

function eventDiscoveryPlugin(): Plugin {
  let checker: TypeChecker;

  return {
    name: 'vds-events',
    async init(program) {
      checker = program.getTypeChecker();
    },
    async postbuild(components) {
      await Promise.all(
        components.map(async component => {
          const events = discoverComponentEvents(checker, component);

          traverseHeritageTree(component.heritage, heritage => {
            const heritageComponent = heritage.component ?? heritage.mixin;
            if (isUndefined(heritageComponent)) return;
            const heritageEvents = discoverComponentEvents(
              checker,
              heritageComponent,
            );
            heritageComponent.events.push(...heritageEvents);
          });

          component.events.push(...events);
        }),
      );

      return components;
    },
  };
}

function discoverComponentEvents(
  checker: TypeChecker,
  component: ComponentMeta,
): EventMeta[] {
  function getEventNameFromClass(declaration: ClassDeclaration) {
    const heritage = declaration.heritageClauses![0].types[0];
    const callExpression = heritage.expression as CallExpression;
    return (callExpression.arguments[0] as StringLiteral).text;
  }

  const events: EventMeta[] = [];

  component.source.file.forEachChild(node => {
    if (isImportDeclaration(node)) {
      const importPath = escapeQuotes(node.moduleSpecifier.getText());
      if (importPath.endsWith('.events')) {
        const imports = node.importClause?.namedBindings as NamedImports;
        imports.elements.forEach(el => {
          const declaration = getSourceDeclaration(
            checker,
            el,
          ) as ClassDeclaration;

          const eventName = getEventNameFromClass(declaration);
          const vdsEventName = `vds-${eventName}`;
          const docTags = getDocTags(declaration);

          if (component.events.some(e => e.name === vdsEventName)) return;

          const eventsInterface = declaration
            .getSourceFile()
            .forEachChild(node => {
              if (
                isInterfaceDeclaration(node) &&
                (node.name.escapedText as string).includes('Events')
              ) {
                return node;
              }

              return undefined;
            });

          const eventType = eventsInterface?.members.find(member => {
            const memberEventName = (member.name as StringLiteral)?.text;
            return memberEventName === eventName;
          }) as PropertySignature;

          const typeInfo = getPropTypeInfo(
            checker,
            eventType,
            checker.getTypeAtLocation(eventType),
          );

          events.push({
            node: declaration,
            name: vdsEventName,
            typeInfo,
            documentation: getDocumentation(checker, declaration.name!),
            docTags,
            bubbles: hasDocTag(docTags, 'bubbles'),
            composed: hasDocTag(docTags, 'composed'),
            internal: hasDocTag(docTags, 'internal'),
            deprecated: hasDocTag(docTags, 'deprecated'),
          });
        });
      }
    }
  });

  return events;
}

// -------------------------------------------------------------------------------------------
// Dependency Discovery Plugin
// -------------------------------------------------------------------------------------------

// TODO: Plugin to discover component dependencies/dependents.
function dependencyDiscoveryPlugin(): Plugin {
  return {
    name: 'vds-deps',
    async postbuild(components) {
      // look for deps in the side effect file `vds-*.ts`.
      return components;
    },
  };
}

// -------------------------------------------------------------------------------------------
// Discovery Plugin
// -------------------------------------------------------------------------------------------

// TODO: Plugin to generate component Storybook controls/stories.
function storybookPlugin(): Plugin {
  return {
    name: 'vds-storybook',
  };
}

// -------------------------------------------------------------------------------------------
// Utilities
// -------------------------------------------------------------------------------------------

function getSourceDeclaration(
  checker: TypeChecker,
  importSpecifier: ImportSpecifier,
): Declaration | undefined {
  const type = checker.getTypeAtLocation(importSpecifier);
  const sourceFile = getTypeSourceFile(type);
  const fileSymbol = checker.getSymbolAtLocation(sourceFile);
  const symbol = fileSymbol?.exports?.get(importSpecifier.name.escapedText);
  return symbol?.getDeclarations()?.[0];
}
