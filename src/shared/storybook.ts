import { TemplateResult } from 'lit-element';

export interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

// V8ToIstanbul fails when no value is exported.
export default class {}
