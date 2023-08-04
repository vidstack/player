let editorId = 0;

export interface CodeFile {
  path: string;
  snippet: string;
  type?: CodeFileType;
}

export type CodeFileType = 'pkg' | 'ts' | 'tsx' | 'dts' | 'tailwind' | 'next';

export interface TreeFolder {
  name: string;
  expanded: boolean;
  children: TreeItem[];
}

export interface TreeFile extends CodeFile {
  name: string;
  index: number;
  selected: boolean;
}

export type TreeItem = TreeFolder | TreeFile;

export function genCodeEditorId() {
  return ++editorId;
}

export function getCodeSnippetId(editorId: number, index: number) {
  return `mock-code-snippet-${editorId}-${index}`;
}

export function buildTreeItems(files: CodeFile[], openFile?: CodeFile): TreeItem[] {
  const root: TreeItem[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i],
      tree = file.path.split('/'),
      name = tree.pop()!,
      type = getFileType(name),
      selected = file === openFile;

    const item: TreeItem = {
      ...file,
      name,
      index: i,
      type,
      selected,
    };

    let folder: TreeFolder | undefined;
    for (let i = 0; i < tree.length; i++) {
      const name = tree[i],
        children = folder?.children ?? root;

      folder = children.find((f) => f.name === name && 'children' in f) as TreeFolder | undefined;

      if (!folder) {
        children.push(
          (folder = {
            name,
            expanded: selected,
            children: [],
          }),
        );
        children.sort(sortFiles);
      } else if (!folder.expanded) {
        folder.expanded = item.selected;
      }
    }

    if (!folder) {
      root.push(item);
    } else {
      folder.children.push(item);
      folder.children.sort(sortFiles);
    }
  }

  return root.sort(sortFiles);
}

function sortFiles(fileA: TreeItem, fileB: TreeItem) {
  if ('children' in fileA && !('children' in fileB)) {
    return -1;
  } else if ('children' in fileB) {
    return 1;
  } else if (fileA.name < fileB.name) {
    return -1;
  } else if (fileA.name > fileB.name) {
    return 1;
  } else {
    return 0;
  }
}

export function findActiveFile(files: CodeFile[], openFile: string) {
  return files.find((file) => file.path === openFile);
}

export function getFileType(path: string): CodeFile['type'] {
  if (path.endsWith('.d.ts')) return 'dts';
  else if (path.startsWith('next.config')) return 'next';
  else if (path.startsWith('tailwind')) return 'tailwind';
  else if (path === 'package.json') return 'pkg';
  else return path.split('.').pop() as CodeFile['type'];
}
