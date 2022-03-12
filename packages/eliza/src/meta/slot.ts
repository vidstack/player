import { filterUnique } from '@vidstack/foundation';
import kleur from 'kleur';

import { LogLevel, reportDiagnosticByNode } from '../logger';
import { type DocTagMeta, type SlotMeta } from './component';
import { splitJsDocTagText } from './doc-tags';

export function buildSlotMeta(tags: DocTagMeta[]): SlotMeta[] {
  let defaultSlots = 0;
  let hasSeenDefaultSlot = false;

  const slots = tags.filter((tag) => tag.name === 'slot').map((tag) => splitJsDocTagText(tag));

  return filterUnique(slots, 'title', {
    onDuplicateFound: (slot) => {
      reportDiagnosticByNode(
        `Found duplicate \`@slot\` tags with the name \`${slot.title}\`.`,
        slot.node,
        LogLevel.Warn,
      );
    },
  }).map((slot) => {
    const isDefault = !slot.title;

    if (isDefault && hasSeenDefaultSlot) {
      reportDiagnosticByNode(
        [
          'Non default `@slot` tag is missing a title.',
          `\n${kleur.bold('EXAMPLE')}\n\n@slot body - Used to pass in the body of this component.`,
        ].join('\n'),
        slot.node,
        LogLevel.Warn,
      );
    }

    if (isDefault) {
      defaultSlots += 1;
      hasSeenDefaultSlot = true;
    }

    return {
      name: isDefault ? 'DEFAULT' : slot.title ?? '',
      default: isDefault && defaultSlots === 1,
      description: slot.description.replace(/^-\s/, '') ?? '',
      node: slot.node,
    };
  });
}
