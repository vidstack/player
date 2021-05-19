import { VdsElement } from '../shared/elements';

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

	provide(host: VdsElement): ContextProvider<T>;

	consume(
		host: VdsElement,
		options?: ContextConsumeOptions<T>
	): ContextConsumer<T>;
}

export type ExtractContextType<C> = C extends Context<infer X> ? X : never;

export type ContextTuple = readonly [Context<any>, ...Array<Context<any>>];

export type ContextTupleValues<Tuple> = {
	readonly [K in keyof Tuple]: ExtractContextType<Tuple[K]>;
};

export type DerivedContext<T> = Omit<Context<T>, 'provide'> & {
	provide(host: VdsElement): Readonly<ContextProvider>;
};

export type ContextRecord<RecordType> = {
	readonly [P in keyof RecordType]: Context<RecordType[P]>;
};

export type ContextProviderRecord<
	ContextRecordType extends ContextRecord<any>
> = {
	readonly [P in keyof ContextRecordType]: ReturnType<
		ContextRecordType[P]['provide']
	>;
};
