/**
 * @template {string} T
 * @param {T} eventType
 * @param {boolean} [hideInTable=true]
 * @returns {{ action: T, table: { disable: boolean } }}
 */
export const storybookAction = (eventType, hideInTable = true) => ({
  action: eventType,
  table: { disable: hideInTable }
});
