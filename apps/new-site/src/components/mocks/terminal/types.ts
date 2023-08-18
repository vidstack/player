export type TerminalPrompt =
  | string
  | TerminalTextPrompt
  | TerminalListPrompt
  | TerminalUploadPrompt
  | TerminalCommand.Clear;

export const enum TerminalCommand {
  Clear = 0,
}

export const enum TerminalPromptType {
  Text = 0,
  List = 1,
  Upload = 2,
}

export interface TerminalTextPrompt {
  type: TerminalPromptType.Text;
  text: string;
  loadDuration?: number;
  loadedText?: string;
  process?: TerminalProcessText[];
}

export interface TerminalListPrompt {
  type: TerminalPromptType.List;
  start?: number;
  select?: number;
  options: string[];
  process?: string[];
}

export interface TerminalUploadPrompt {
  type: TerminalPromptType.Upload;
  text: string;
  duration: number;
}

export type TerminalProcessText =
  | string
  | TerminalProcessTextDiffPos
  | TerminalProcessTextDiffNeg
  | TerminalProcessTextProgress;

export interface TerminalProcessTextDiffPos {
  type: 'diff-pos';
  text: string;
}

export interface TerminalProcessTextDiffNeg {
  type: 'diff-neg';
  text: string;
}

export interface TerminalProcessTextProgress {
  type: 'progress';
  text: (percent: number) => string;
  duration: number;
}
