import type { JSX, ReadSignal } from 'maverick.js';

import type { RadioGroupChangeEvent } from './radio-group';

export function renderRadioGroup(props: RenderRadioGroupProps) {
  const { value, onChange, radioGroupClass } = props;
  return (
    <media-radio-group class={radioGroupClass()} $prop:value={value()} $on:change={onChange}>
      {renderOptions(props)}
    </media-radio-group>
  );
}

function renderOptions(props: RenderRadioGroupProps) {
  const { options } = props;
  return () =>
    options().map((option) => (
      <media-radio part={props.part} $prop:value={option.value}>
        {option.content}
      </media-radio>
    ));
}

export interface RenderRadioGroupProps {
  part?: string;
  value: ReadSignal<string>;
  options: ReadSignal<{ value: string; content: JSX.Element }[]>;
  radioGroupClass: ReadSignal<string | null>;
  onChange(event: RadioGroupChangeEvent): void;
}
