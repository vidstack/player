import type { ReadSignal } from 'maverick.js';

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
  const { options, radioClass, radioCheckClass } = props;
  return () =>
    options().map((option) => (
      <media-radio
        class={radioClass()}
        $prop:value={option.value}
        $prop:checkClass={radioCheckClass()}
      >
        <span>{option.label}</span>
      </media-radio>
    ));
}

export interface RenderRadioGroupProps {
  value: ReadSignal<string>;
  options: ReadSignal<{ label: string; value: string }[]>;
  radioGroupClass: ReadSignal<string | null>;
  radioClass: ReadSignal<string | null>;
  radioCheckClass: ReadSignal<string | null>;
  onChange(event: RadioGroupChangeEvent): void;
}
