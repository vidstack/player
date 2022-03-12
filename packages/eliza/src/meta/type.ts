/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/default, no-bitwise, no-case-declarations */

import type {
  ArrayLiteralExpression,
  ComputedPropertyName,
  Expression,
  Identifier,
  LiteralExpression,
  ObjectLiteralExpression,
  PropertyName,
  SourceFile,
  StringLiteral,
  Type,
  TypeChecker,
  UnionType,
} from 'typescript';
import ts from 'typescript';

import type { TypeText } from './component';

export function getTypeSourceFile(type: Type): SourceFile {
  const declarations = type.aliasSymbol?.getDeclarations() ?? type.getSymbol()!.getDeclarations();
  return declarations![0].getSourceFile();
}

export function resolveType(checker: TypeChecker, type: Type): string {
  const set = new Set<string>();
  parseDocsType(checker, type, set);

  // Normalize booleans.
  const hasTrue = set.delete('true');
  const hasFalse = set.delete('false');

  if (hasTrue || hasFalse) {
    set.add('boolean');
  }

  let parts = Array.from(set.keys()).sort();

  if (parts.length > 1) {
    parts = parts.map((p) => (p.indexOf('=>') >= 0 ? `(${p})` : p));
  }

  if (parts.length > 20) {
    return typeToString(checker, type);
  }

  return parts.join(' | ');
}

export function parseDocsType(checker: TypeChecker, type: Type, parts: Set<string>): void {
  if (type.isUnion()) {
    (type as UnionType).types.forEach((t) => {
      parseDocsType(checker, t, parts);
    });
  } else {
    const text = typeToString(checker, type);
    parts.add(text);
  }
}

export function typeToString(checker: TypeChecker, type: Type): string {
  const TYPE_FORMAT_FLAGS =
    ts.TypeFormatFlags.NoTruncation |
    ts.TypeFormatFlags.InTypeAlias |
    ts.TypeFormatFlags.InElementType;

  return checker.typeToString(type, undefined, TYPE_FORMAT_FLAGS);
}

function getTextOfPropertyName(propName: PropertyName): string | undefined {
  switch (propName.kind) {
    case ts.SyntaxKind.Identifier:
      return (<Identifier>propName).text;
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NumericLiteral:
      return (<LiteralExpression>propName).text;
    case ts.SyntaxKind.ComputedPropertyName:
      const { expression } = <ComputedPropertyName>propName;
      if (ts.isStringLiteral(expression) || ts.isNumericLiteral(expression)) {
        return (<LiteralExpression>(<ComputedPropertyName>propName).expression).text;
      }
  }

  return undefined;
}

export function getIdentifierValue(escapedText: string): ConvertIdentifier {
  return {
    __identifier: true,
    __escapedText: escapedText,
  };
}

export function arrayLiteralToArray(arr: ArrayLiteralExpression): unknown[] {
  return arr.elements.map((element) => {
    let val: unknown;

    switch (element.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        val = objectLiteralToObjectMap(element as ObjectLiteralExpression);
        break;

      case ts.SyntaxKind.StringLiteral:
        val = (element as StringLiteral).text;
        break;

      case ts.SyntaxKind.TrueKeyword:
        val = true;
        break;

      case ts.SyntaxKind.FalseKeyword:
        val = false;
        break;

      case ts.SyntaxKind.Identifier:
        const { escapedText } = element as Identifier;
        if (escapedText === 'String') {
          val = String;
        } else if (escapedText === 'Number') {
          val = Number;
        } else if (escapedText === 'Boolean') {
          val = Boolean;
        }
        break;

      case ts.SyntaxKind.PropertyAccessExpression:
      default:
        val = element;
    }

    return val;
  });
}

export function objectLiteralToObjectMap(objectLiteral: ObjectLiteralExpression): ObjectMap {
  const { properties } = objectLiteral;
  const final: ObjectMap = {};

  for (const propAssignment of properties) {
    let val: unknown;

    const propName = getTextOfPropertyName(propAssignment.name as PropertyName) as string;

    if (ts.isShorthandPropertyAssignment(propAssignment)) {
      val = getIdentifierValue(propName);
    } else if (ts.isPropertyAssignment(propAssignment)) {
      switch (propAssignment.initializer.kind) {
        case ts.SyntaxKind.ArrayLiteralExpression:
          val = arrayLiteralToArray(propAssignment.initializer as ArrayLiteralExpression);
          break;

        case ts.SyntaxKind.ObjectLiteralExpression:
          val = objectLiteralToObjectMap(propAssignment.initializer as ObjectLiteralExpression);
          break;

        case ts.SyntaxKind.StringLiteral:
          val = (propAssignment.initializer as StringLiteral).text;
          break;

        case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
          val = (propAssignment.initializer as StringLiteral).text;
          break;

        case ts.SyntaxKind.TrueKeyword:
          val = true;
          break;

        case ts.SyntaxKind.FalseKeyword:
          val = false;
          break;

        case ts.SyntaxKind.Identifier:
          const { escapedText } = propAssignment.initializer as Identifier;

          if (escapedText === 'String') {
            val = String;
          } else if (escapedText === 'Number') {
            val = Number;
          } else if (escapedText === 'Boolean') {
            val = Boolean;
          } else if (escapedText === 'undefined') {
            val = undefined;
          } else if (escapedText === 'null') {
            val = null;
          } else {
            val = getIdentifierValue(
              (propAssignment.initializer as Identifier).escapedText as string,
            );
          }
          break;
        case ts.SyntaxKind.PropertyAccessExpression:
        default:
          val = propAssignment.initializer;
      }
    }

    final[propName] = val as Expression | ObjectMap;
  }

  return final;
}

export interface ConvertIdentifier {
  __identifier: boolean;
  __escapedText: string;
}

export class ObjectMap {
  [key: string]: Expression | ObjectMap;
}

export function typeTextFromTSType(type: Type): TypeText {
  const isAnyType = checkType(type, isAny);
  if (isAnyType) return 'any';

  const isStr = checkType(type, isString);
  const isNum = checkType(type, isNumber);
  const isBool = checkType(type, isBoolean);

  // if type is more than a primitive type at the same time, we mark it as any.
  if (Number(isStr) + Number(isNum) + Number(isBool) > 1) return 'any';
  // At this point we know the prop's type is NOT the mix of primitive types.
  if (isStr) return 'string';
  if (isNum) return 'number';
  if (isBool) return 'boolean';
  return 'unknown';
}

const checkType = (type: Type, check: (type: Type) => boolean) => {
  if (type.flags & ts.TypeFlags.Union) {
    const union = type as UnionType;
    if (union.types.some((t) => checkType(t, check))) {
      return true;
    }
  }

  return check(type);
};

const isBoolean = (t: Type) => {
  if (t) {
    return !!(
      t.flags &
      (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLike | ts.TypeFlags.BooleanLike)
    );
  }

  return false;
};

const isNumber = (t: Type) => {
  if (t) {
    return !!(
      t.flags &
      (ts.TypeFlags.Number | ts.TypeFlags.NumberLike | ts.TypeFlags.NumberLiteral)
    );
  }

  return false;
};

const isString = (t: Type) => {
  if (t) {
    return !!(
      t.flags &
      (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral)
    );
  }

  return false;
};

const isAny = (t: Type) => {
  if (t) {
    return !!(t.flags & ts.TypeFlags.Any);
  }

  return false;
};
