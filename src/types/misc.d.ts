export type Constructor<T = object> = {
	new (...args: any[]): T;
	prototype: T;
};

export type Writeable<T> = {
	-readonly [P in keyof T]: T[P];
};

export type MethodsOnly<T> = Omit<
	T,
	{
		[K in keyof T]-?: T[K] extends Function ? never : K;
	}[keyof T]
>;

export type Callback<ValueType> = (value: ValueType) => void;

export type UnknownFunction = (...args: unknown[]) => unknown;

export type Unsubscribe = Callback<void>;

export interface Cancelable {
	cancel(): void;
}
