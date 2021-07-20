/**
 * @template {string} T
 * @param {T} eventType
 * @param {boolean} [hideInTable=true]
 * @returns {{ action: T, table: { disable: boolean } }}
 */
export function storybookAction<T extends string>(eventType: T, hideInTable?: boolean | undefined): {
    action: T;
    table: {
        disable: boolean;
    };
};
