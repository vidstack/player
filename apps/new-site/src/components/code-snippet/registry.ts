import type { CodeSnippet } from ':code_snippets';

const registry = new Map<string, CodeSnippet>();

export function getLoadedCodeSnippet(id: string) {
  return registry.get(id);
}

export function registerCodeSnippet(id: string, snippet: CodeSnippet) {
  registry.set(id, snippet);
}
