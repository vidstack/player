import { Lit, LitElement, PropertyDeclarations } from 'lit';

import { Constructor, ReadonlyIfType } from '../types/utils.js';

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

export type ContextConsumerDetail<T = any> = {
	onConnect(): void;
	onUpdate(newValue: T): void;
	onDisconnect(callback: () => void): void;
};

export type ContextConsumeOptions<T> = ContextOptions<T> & {
	transform?: (newValue: T) => T;
};

export type ContextProvideOptions<T> = ContextOptions<T>;

export interface Context<T> {
	initialValue: T;
	provide(
		host: ContextHost,
		options?: ContextProvideOptions<T>
	): ContextProvider<T>;
	consume(
		host: ContextHost,
		options?: ContextConsumeOptions<T>
	): ContextConsumer<T>;
}

export type DerivedContext<T> = Omit<Context<T>, 'provide'> & {
	provide(host: ContextHost): Readonly<ContextProvider<T>>;
	isDerived: true;
};

export type ContextConsumerDeclarationOptions<T> = {
	context: Context<T>;
} & ContextConsumeOptions<T>;

export type ContextConsumerDeclaration<T> =
	| Context<T>
	| ContextConsumerDeclarationOptions<T>;

export type ContextProviderDeclarationOptions<T> = {
	context: Context<T>;
} & ContextProvideOptions<T>;

export type ContextProviderDeclaration<T> =
	| Context<T>
	| ContextProviderDeclarationOptions<T>;

export interface ContextConsumerDeclarations {
	readonly [key: string]: ContextConsumerDeclaration<any>;
}

export interface ContextProviderDeclarations {
	readonly [key: string]: ContextProviderDeclaration<any>;
}

export type ContextHost = LitElement;

export interface ContextHostConstructor {
	new (...args: any[]): ContextHost;
	readonly contextConsumers?: ContextConsumerDeclarations;
	readonly contextProviders?: ContextProviderDeclarations;
}

export interface ContextInitializer extends Constructor {
	defineContextConsumer<T>(
		name: string | symbol,
		context: Context<T>,
		options?: ContextConsumeOptions<T>
	): void;
	defineContextProvider<T>(
		name: string | symbol,
		context: Context<T>,
		options?: ContextProvideOptions<T>
	): void;
}

export type ExtractContextType<C> = C extends Context<infer X> ? X : never;

export type ContextTuple = readonly [Context<any>, ...Array<Context<any>>];

export type ContextTupleValues<Tuple> = {
	readonly [K in keyof Tuple]: ExtractContextType<Tuple[K]>;
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
