/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ComponentMeta,
  customElementsManifestPlugin,
  EventMeta,
  litElementPlugin,
  Plugin,
  storybookManifestPlugin,
  vscodeCustomDataPlugin,
} from '@wcom/cli';
import {
  escapeQuotes,
  getDocTags,
  getDocumentation,
  getPropTypeInfo,
  getTypeSourceFile,
  hasDocTag,
  isUndefined,
  pascalToDashCase,
  traverseHeritageTree,
} from '@wcom/cli/dist/utils';
import {
  ClassDeclaration,
  Declaration,
  Identifier,
  ImportSpecifier,
  isClassDeclaration,
  isImportDeclaration,
  isInterfaceDeclaration,
  NamedImports,
  PropertySignature,
  SourceFile,
  StringLiteral,
  TypeChecker,
} from 'typescript';

export default [
  litElementPlugin(),
  addImportPathExamplePlugin(),
  eventDiscoveryPlugin(),
  dependencyDiscoveryPlugin(),
  storybookManifestPlugin({
    extendProperty(prop) {
      const enumMembers = prop.enumDeclaration?.members;
      const labels: Record<string, string> = {};
      const options: string[] = [];

      enumMembers?.forEach(member => {
        const name = (member.name as Identifier).escapedText as string;
        const value = (member.initializer as StringLiteral).text;
        labels[name] = value;
        options.push(name);
      });

      return {
        enum: prop.enum,
        readonly: prop.readonly,
        labels: prop.enum ? labels : undefined,
        options: prop.enum ? options : undefined,
        typeInfo: {
          text: prop.typeText,
          original: prop.typeInfo.original,
          resolved: prop.typeInfo.resolved,
        },
      };
    },
  }),
  vscodeCustomDataPlugin(),
  customElementsManifestPlugin(),
];

// -------------------------------------------------------------------------------------------
// Import Path Example Plugin
// -------------------------------------------------------------------------------------------

function addImportPathExamplePlugin(): Plugin {
  return {
    name: 'vds-import-path-example',
    async postbuild(components) {
      components.forEach(component => {
        const path = component.source.dirPath.replace(/.+src\//, '');

        component.docTags.unshift({
          node: {} as never,
          name: 'example',
          text: `\`\`\`ts\nimport '@vidstack/elements/${path}/${component.tagName}';\n\`\`\``,
        });
      });

      return components;
    },
  };
}

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
  const events: EventMeta[] = [];

  component.source.file.forEachChild(node => {
    if (isImportDeclaration(node)) {
      const imports = node.importClause?.namedBindings as NamedImports;

      imports?.elements.forEach(importSpecifier => {
        const declaration = getSourceDeclaration(checker, importSpecifier);

        if (declaration && isClassDeclaration(declaration)) {
          const className = declaration.name?.escapedText as string;
          if (className.endsWith('Event') && className !== 'VdsCustomEvent') {
            const event = buildEventMeta(checker, declaration);
            events.push(event);
          }
        }
      });
    }
  });

  return events.filter(
    event => !component.events.some(e => e.name === event.name),
  );
}

function buildEventMeta(
  checker: TypeChecker,
  eventDeclaration: ClassDeclaration,
): EventMeta {
  const className = eventDeclaration.name?.escapedText as string;

  const eventName = pascalToDashCase(className)
    // some reason a `-` is appearing at the start?
    .slice(1)
    .trim()
    .replace('-event', '');

  const docTags = getDocTags(eventDeclaration);

  const eventsInterface = eventDeclaration
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
    return memberEventName === eventName.replace('vds-', '');
  }) as PropertySignature;

  const typeInfo = getPropTypeInfo(
    checker,
    eventType,
    checker.getTypeAtLocation(eventType),
  );

  return {
    node: eventDeclaration,
    name: eventName,
    typeInfo,
    documentation: getDocumentation(checker, eventDeclaration.name!),
    docTags,
    bubbles: hasDocTag(docTags, 'bubbles'),
    composed: hasDocTag(docTags, 'composed'),
    internal: hasDocTag(docTags, 'internal'),
    deprecated: hasDocTag(docTags, 'deprecated'),
  };
}

// -------------------------------------------------------------------------------------------
// Dependency Discovery Plugin
// -------------------------------------------------------------------------------------------

function dependencyDiscoveryPlugin(): Plugin {
  return {
    name: 'vds-deps',
    async postbuild(components, sourceFiles) {
      sourceFiles.forEach(sourceFile => {
        const path = sourceFile.fileName;
        components.forEach(component => {
          const definitionFile = `${component.className!}.ts`;
          if (path.endsWith(definitionFile)) {
            const deps = findDependencies(components, sourceFile).filter(
              dep => dep.tagName !== component.tagName,
            );

            component.dependencies.push(...deps);

            deps.forEach(dep => {
              const notFound = !dep.dependents.some(
                c => c.tagName === component.tagName,
              );
              if (notFound) dep.dependents.push(component);
            });
          }
        });
      });

      return components;
    },
  };
}

function findDependencies(
  components: ComponentMeta[],
  sourceFile: SourceFile,
): ComponentMeta[] {
  const deps: ComponentMeta[] = [];

  sourceFile.forEachChild(node => {
    if (isImportDeclaration(node)) {
      const importPath = escapeQuotes(node.moduleSpecifier.getText());
      if (importPath.startsWith('../')) {
        const dep = components.find(c => importPath.includes(c.tagName!));
        if (!isUndefined(dep)) deps.push(dep);
      }
    }
  });

  return deps;
}

// -------------------------------------------------------------------------------------------
// Utilities
// -------------------------------------------------------------------------------------------

function getSourceDeclaration(
  checker: TypeChecker,
  importSpecifier: ImportSpecifier,
): Declaration | undefined {
  try {
    const type = checker.getTypeAtLocation(importSpecifier);
    const sourceFile = getTypeSourceFile(type);
    const fileSymbol = checker.getSymbolAtLocation(sourceFile);
    const symbol = fileSymbol?.exports?.get(importSpecifier.name.escapedText);
    return symbol?.getDeclarations()?.[0];
  } catch (e) {
    return undefined;
  }
}
