import { Lit, LitElement, PropertyDeclarations } from 'lit';

import { Constructor, ReadonlyIfType } from '../types/utils';

export type ContextConsumerDeclaration = Context<any>;

export interface ContextConsumerDeclarations {
	readonly [key: string]: ContextConsumerDeclaration;
}

export type ContextProviderDeclaration = Context<any>;

export interface ContextProviderDeclarations {
	readonly [key: string]: ContextProviderDeclaration;
}

export type ContextHost = LitElement;

export interface ContextHostConstructor {
	new (...args: any[]): ContextHost;
	readonly contextConsumers?: ContextConsumerDeclarations;
	readonly contextProviders?: ContextProviderDeclarations;
}

export interface ContextInitializer extends Constructor {
	defineContextConsumer(context: Context<any>, name: string): void;
	defineContextProvider(context: Context<any>, name: string): void;
}

export interface ContextConsumerDetail {
	onConnect(): void;
	onUpdate(newValue: any): void;
	onDisconnect(callback: () => void): void;
}

export interface ContextProvider<T> {
	value: T;
	reset(): void;
}

export interface ContextConsumer<T> {
	readonly value: T;
}

export interface ContextConsumeOptions<T> {
	onConnect?(): void;
	onUpdate?(newValue: T): void;
	onDisconnect?(): void;
}

export interface Context<T> {
	initialValue: T;

	provide(host: ContextHost): ContextProvider<T>;

	consume(
		host: ContextHost,
		options?: ContextConsumeOptions<T>
	): ContextConsumer<T>;
}

export type ExtractContextType<C> = C extends Context<infer X> ? X : never;

export type ContextTuple = readonly [Context<any>, ...Array<Context<any>>];

export type ContextTupleValues<Tuple> = {
	readonly [K in keyof Tuple]: ExtractContextType<Tuple[K]>;
};

export type DerivedContext<T> = Omit<Context<T>, 'provide'> & {
	provide(host: ContextHost): Readonly<ContextProvider<T>>;
	isDerived: true;
};

export type ContextRecord<RecordType> = {
	readonly [P in keyof RecordType]:
		| Context<RecordType[P]>
		| DerivedContext<RecordType[P]>;
};

export type ExtractContextRecordTypes<
	ContextRecordType extends ContextRecord<any>
> = {
	[P in keyof ContextRecordType]: ExtractContextType<ContextRecordType[P]>;
};

export type ContextProviderRecord<
	ContextRecordType extends ContextRecord<any>
> = ExtractContextRecordTypes<
	ReadonlyIfType<DerivedContext<any>, ContextRecordType>
>;
