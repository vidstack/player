import { UpdatingElement } from 'lit-element';

export interface ContextProvider<T> {
	value: T;
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

	provide(host: UpdatingElement): ContextProvider<T>;

	consume(
		host: UpdatingElement,
		options?: ContextConsumeOptions<T>
	): ContextConsumer<T>;
}

export type ExtractContextType<Type> = Type extends Context<infer X> ? X : void;

export type ExtractContextArray<T extends readonly Context<any>[]> = {
	[K in keyof T]: ExtractContextType<T[K]>;
};

export type DerivedContext<T> = Omit<Context<T>, 'provide'> & {
	provide(host: UpdatingElement): Readonly<ContextProvider>;
};

export type ContextRecord<R> = {
	readonly [P in keyof R]: Context<R[P]>;
};
