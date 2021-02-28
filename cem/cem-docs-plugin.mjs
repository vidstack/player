/* eslint-disable */
import ts from 'typescript';
import { getDocumentation } from './cem-helpers.mjs';

function visitMember(member, doc, typeChecker) {
  const identifier = member.name;
  const description = getDocumentation(typeChecker, identifier);

  const memberDoc = (doc.members ?? []).find(
    member => member.name === identifier?.escapedText,
  );

  if (memberDoc) {
    memberDoc.description = description;
  }
}

export function cemDocsPlugin() {
  return {
    analyzePhase({ node, moduleDoc, typeChecker }) {
      if (ts.isClassDeclaration(node)) {
        const name = node.name?.escapedText;
        const classDoc = moduleDoc.declarations.find(d => d.name === name);
        node.members?.forEach(member =>
          visitMember(member, classDoc, typeChecker),
        );
      }
    },
  };
}
