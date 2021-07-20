import { ReactiveElement } from 'lit';
import { Constructor, ReadonlyIfType } from '../types';
export interface ContextProvider<T> {
    value: T;
    reset(): void;
}
export interface ContextConsumer<T> {
    readonly value: T;
}
export interface ContextOptions<T = unknown> {
    onConnect?(): void;
    onUpdate?(newValue: T): void;
    onDisconnect?(): void;
}
export declare type ContextConsumerDetail<T = any> = {
    onConnect(): void;
    onUpdate(newValue: T): void;
    onDisconnect(callback: () => void): void;
};
export declare type ContextConsumeOptions<T> = ContextOptions<T> & {
    transform?: (newValue: T) => T;
    shouldRequestUpdate?: boolean;
    debug?: boolean;
};
export declare type ContextProvideOptions<T> = ContextOptions<T> & {
    debug?: boolean;
};
export interface Context<T> {
    initialValue: T;
    provide(host: ContextHost, options?: ContextProvideOptions<T>): ContextProvider<T>;
    consume(host: ContextHost, options?: ContextConsumeOptions<T>): ContextConsumer<T>;
}
export declare type DerivedContext<T> = Omit<Context<T>, 'provide'> & {
    provide(host: ContextHost): Readonly<ContextProvider<T>>;
    isDerived: true;
};
export declare type ContextConsumerDeclarationOptions<T> = {
    context: Context<T>;
} & ContextConsumeOptions<T>;
export declare type ContextConsumerDeclaration<T> = Context<T> | ContextConsumerDeclarationOptions<T>;
export declare type ContextProviderDeclarationOptions<T> = {
    context: Context<T>;
} & ContextProvideOptions<T>;
export declare type ContextProviderDeclaration<T> = Context<T> | ContextProviderDeclarationOptions<T>;
export declare type ContextConsumerDeclarations<T = any> = {
    readonly [P in keyof T]: ContextConsumerDeclaration<any>;
};
export declare type ContextProviderDeclarations<T = any> = {
    readonly [P in keyof T]: ContextProviderDeclaration<any>;
};
export declare type ContextHost = ReactiveElement;
export interface ContextHostConstructor {
    new (...args: any[]): ContextHost;
    readonly contextConsumers?: ContextConsumerDeclarations;
    readonly contextProviders?: ContextProviderDeclarations;
}
export interface ContextInitializer extends Constructor {
    defineContextConsumer<T>(name: string | symbol, context: Context<T>, options?: ContextConsumeOptions<T>): void;
    defineContextProvider<T>(name: string | symbol, context: Context<T>, options?: ContextProvideOptions<T>): void;
}
export declare type ExtractContextType<C> = C extends Context<infer X> ? X : never;
export declare type ContextTuple = readonly [Context<any>, ...Array<Context<any>>];
export declare type ContextTupleValues<Tuple> = {
    readonly [K in keyof Tuple]: ExtractContextType<Tuple[K]>;
};
export declare type ContextRecord<RecordType> = {
    readonly [P in keyof RecordType]: Context<RecordType[P]> | DerivedContext<RecordType[P]>;
};
export declare type ExtractContextRecordTypes<ContextRecordType extends ContextRecord<any>> = {
    [P in keyof ContextRecordType]: ExtractContextType<ContextRecordType[P]>;
};
export declare type ContextProviderRecord<ContextRecordType extends ContextRecord<any>> = ExtractContextRecordTypes<ReadonlyIfType<DerivedContext<any>, ContextRecordType>>;
