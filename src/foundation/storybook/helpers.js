/**
 * @template {keyof GlobalEventHandlersEventMap} T
 * @param {T} eventType
 * @param {boolean} [hideInTable=true]
 * @returns {{ action: T, table: { disable: boolean } }}
 */
export function storybookAction(eventType, hideInTable = true) {
  return {
    action: eventType,
    table: { disable: hideInTable }
  };
}
