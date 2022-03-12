import normalizePath from 'normalize-path';
import { basename, parse } from 'path';
import type { Node } from 'typescript';

import { type SourceMeta } from './component';

export function buildSourceMeta(node: Node): SourceMeta {
  const sourceFile = node.getSourceFile();
  const sourceFilePath = normalizePath(sourceFile.fileName);
  const sourceFileInfo = parse(sourceFilePath);

  return {
    node: sourceFile,
    file: sourceFile,
    fileBase: sourceFileInfo.base,
    fileName: sourceFileInfo.name,
    filePath: sourceFilePath,
    fileExt: sourceFileInfo.ext,
    dirName: basename(sourceFileInfo.dir),
    dirPath: sourceFileInfo.dir,
  };
}
