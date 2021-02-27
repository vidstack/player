/* eslint-disable */
import ts from 'typescript';
import { compileOnce, parseGlobs } from './cem-helpers.mjs';

const filePaths = await parseGlobs('src/{core,providers,ui}/**/*.ts');
const program = compileOnce(filePaths);
const checker = program.getTypeChecker();

export function cemDocsPlugin() {
  return {
    analyzePhase({ node }) {
      if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
        console.log(node.name?.escapedText);
      }
    },
  };
}
