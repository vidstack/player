declare const VdsElement_base: import("../context/types.js").ContextInitializer & typeof LitElement;
export class VdsElement extends VdsElement_base {
    /** @type {string[]} */
    static get parts(): string[];
    /** @type {string[]} */
    static get events(): string[];
    /**
     * @protected
     * @readonly
     */
    protected readonly disconnectDisposal: DisposalBin;
}
import { LitElement } from "lit-element/lit-element";
import { DisposalBin } from "../events/events.js";
export {};
