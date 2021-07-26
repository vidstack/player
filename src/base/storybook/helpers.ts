export type StorybookActionDeclaration = {
  action: string;
  table: { disable: boolean };
};

export function storybookAction(
  eventType: keyof GlobalEventHandlersEventMap,
  hideInTable = true
): StorybookActionDeclaration {
  return {
    action: eventType,
    table: { disable: hideInTable }
  };
}
