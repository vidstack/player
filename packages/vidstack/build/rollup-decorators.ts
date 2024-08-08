import MagicString from 'magic-string';
import type { Plugin } from 'rollup';
import * as ts from 'typescript';

export function decorators(): Plugin {
  return {
    name: 'decorators',
    transform(code, id) {
      if (id.endsWith('.ts')) {
        return transformDecorators(code, id);
      }
    },
  };
}

function transformDecorators(source: string, id: string) {
  let code = new MagicString(source),
    // 99 = ScriptTarget.ESNext, 1 = ScriptKind.JS
    sourceFile = ts.createSourceFile(id, code.original, 99, true, 1),
    map: ClassDecoratorMap = new Map();

  ts.forEachChild(sourceFile, (node) => visit(node, map));

  for (const classDeclaration of map.keys()) {
    const className = classDeclaration.name as ts.Identifier,
      classNameText = className.escapedText as string,
      classProtoName = `${classNameText.toLowerCase()}__proto`,
      classEnd = classDeclaration.getEnd(),
      decorators = map.get(classDeclaration)!,
      decorations: string[] = [];

    for (const { member, decorator } of decorators) {
      const memberName = member.name.getText(),
        decoratorName = (decorator.expression as ts.Identifier).escapedText as string;

      code.update(decorator.getStart(), decorator.getEnd(), '');

      decorations.push(`${decoratorName}(${classProtoName}, "${memberName}");`);
    }

    code.appendRight(
      classEnd + 1,
      [
        '',
        `const ${classProtoName} = ${classNameText}.prototype;`,
        decorations.join('\n'),
        '',
      ].join('\n'),
    );
  }

  return {
    code: code.toString(),
    map: code.generateMap({ source: id }),
  };
}

function visit(node: ts.Node, map: ClassDecoratorMap) {
  if (!ts.isClassDeclaration(node) || !node.name || !ts.isIdentifier(node.name)) return;

  const decorators: DecoratorMeta[] = [];

  ts.forEachChild(node, (node) => {
    if (isClassMember(node) && isPublic(node)) {
      const decorator = getDecorator(node);
      if (!decorator) return;
      decorators.push({
        member: node,
        decorator,
      });
    }
  });

  if (decorators.length) {
    map.set(node, decorators);
  }
}

type ClassMember = ts.PropertyDeclaration | ts.GetAccessorDeclaration | ts.MethodDeclaration;
type DecoratorMeta = { member: ClassMember; decorator: ts.Decorator };
type ClassDecoratorMap = Map<ts.ClassDeclaration, DecoratorMeta[]>;

function isClassMember(node: ts.Node): node is ClassMember {
  return ts.isPropertyDeclaration(node) || ts.isGetAccessor(node) || ts.isMethodDeclaration(node);
}

function isPublic(node: ClassMember) {
  if (node.modifiers?.some(isPrivateModifier)) return false;
  return node.name.kind !== ts.SyntaxKind.PrivateIdentifier;
}

function getDecorator(node: ClassMember) {
  return node.modifiers ? node.modifiers.find(isDecoratorModifier) : undefined;
}

function isPrivateModifier(mod: ts.ModifierLike) {
  return mod.kind === ts.SyntaxKind.ProtectedKeyword || mod.kind === ts.SyntaxKind.PrivateKeyword;
}

function isDecoratorModifier(mod: ts.ModifierLike): mod is ts.Decorator {
  return mod.kind === ts.SyntaxKind.Decorator && ts.isIdentifier(mod.expression);
}
