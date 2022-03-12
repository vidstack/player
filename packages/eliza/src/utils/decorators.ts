/* eslint-disable import/default */
/* eslint-disable import/no-named-as-default-member */

import type { ClassElement, Decorator, Expression } from 'typescript';
import ts from 'typescript';

import { objectLiteralToObjectMap, type ObjectMap } from '../meta';

export const getDecoratorName = (decorator: Decorator): string =>
  ts.isCallExpression(decorator.expression) ? decorator.expression.expression.getText() : '';

export const isDecoratorNamed =
  (propName: string) =>
  (decorator: Decorator): boolean =>
    getDecoratorName(decorator) === propName;

export const isDecoratedClassMember = (member: ClassElement): boolean =>
  Array.isArray(member.decorators) && member.decorators.length > 0;

export const getDeclarationParameters: GetDeclarationParameters = (decorator: Decorator): any => {
  if (!ts.isCallExpression(decorator.expression)) return [];
  return decorator.expression.arguments.map(getDeclarationParameter);
};

function getDeclarationParameter(arg: Expression): string | ObjectMap {
  if (ts.isObjectLiteralExpression(arg)) {
    return objectLiteralToObjectMap(arg);
  }

  if (ts.isStringLiteral(arg)) {
    return arg.text;
  }

  throw new Error(`Invalid decorator argument: ${arg.getText()}`);
}

export interface GetDeclarationParameters {
  <T>(decorator: Decorator): [T];
  <T, T1>(decorator: Decorator): [T, T1];
  <T, T1, T2>(decorator: Decorator): [T, T1, T2];
}
