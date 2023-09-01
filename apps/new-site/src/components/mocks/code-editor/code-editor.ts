let editorId = 0;

export interface CodeFile {
  path: string;
  snippet: string;
  type?: CodeFileType;
}

export interface ImageFile {
  path: string;
  class?: string;
  imgSrc: string;
  imgAlt: string;
  type?: ImageFileType;
}

export interface VideoFile {
  path: string;
  videoSrc: string;
  type?: VideoFileType;
}

export type EditorFile = CodeFile | ImageFile | VideoFile;

export type CodeFileType =
  | 'pkg'
  | 'ts'
  | 'jsx'
  | 'tsx'
  | 'dts'
  | 'tailwind'
  | 'next'
  | 'css'
  | 'html';

export type ImageFileType = 'png' | 'webp';
export type VideoFileType = 'mp4';
export type EditorFileType = CodeFileType | ImageFileType | VideoFileType;

export interface EditorTreeFolder {
  name: string;
  expanded: boolean;
  children: EditorTreeItem[];
}

export type EditorTreeFile = EditorFile & {
  name: string;
  index: number;
  selected: boolean;
};

export type EditorTreeItem = EditorTreeFolder | EditorTreeFile;

export function genCodeEditorId() {
  return ++editorId;
}

export function getFileId(editorId: number, index: number) {
  return `mock-code-file-${editorId}-${index}`;
}

export function buildTreeItems(files: EditorFile[], openFile?: EditorFile): EditorTreeItem[] {
  const root: EditorTreeItem[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i],
      tree = file.path.split('/'),
      name = tree.pop()!,
      type = getFileType(name),
      selected = file === openFile;

    const item: EditorTreeItem = {
      ...file,
      name,
      index: i,
      type: type as any,
      selected,
    };

    let folder: EditorTreeFolder | undefined;
    for (let i = 0; i < tree.length; i++) {
      const name = tree[i],
        children = folder?.children ?? root;

      folder = children.find((f) => f.name === name && 'children' in f) as
        | EditorTreeFolder
        | undefined;

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

function sortFiles(fileA: EditorTreeItem, fileB: EditorTreeItem) {
  if ('children' in fileA && !('children' in fileB)) {
    return -1;
  } else if ('children' in fileB) {
    return 1;
  } else if ('type' in fileA && fileA.type && /png|webp|mp4/.test(fileA.type)) {
    return 1;
  } else if ('type' in fileB && fileB.type && /png|webp|mp4/.test(fileB.type)) {
    return -1;
  } else if (fileA.name < fileB.name) {
    return -1;
  } else if (fileA.name > fileB.name) {
    return 1;
  } else {
    return 0;
  }
}

export function findActiveFile(files: EditorFile[], openFile: string) {
  return files.find((file) => file.path === openFile);
}

export function isCodeFile(file: EditorFile): file is CodeFile {
  return 'snippet' in file;
}

export function isImageFile(file: EditorFile): file is ImageFile {
  return 'imgSrc' in file;
}

export function isVideoFile(file: EditorFile): file is VideoFile {
  return 'videoSrc' in file;
}

export function getFileType(path: string): EditorFileType {
  if (path.endsWith('.d.ts')) return 'dts';
  else if (path.startsWith('next.config')) return 'next';
  else if (path.startsWith('tailwind.config')) return 'tailwind';
  else if (path === 'package.json') return 'pkg';
  else return path.split('.').pop() as EditorFileType;
}
