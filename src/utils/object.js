/**
 * Walk object prototype chain and collect all property names of the given `object`.
 *
 * @template T
 * @param {T & object} obj
 * @param {object} [BaseConstructor] Stop collecting property names at this prototype.
 * @returns {Set<(keyof T)>}
 */
export function getAllObjectPropertyNames(obj, BaseConstructor = Object) {
	const properties = new Set();

	let proto = obj;

	while (proto != BaseConstructor.prototype) {
		for (let name of Object.getOwnPropertyNames(proto)) {
			properties.add(name);
		}

		proto = Object.getPrototypeOf(proto);
	}

	return properties;
}

/**
 * Proxy whitelisted properties on `objA` to `objB`.
 *
 * @template T
 * @template R
 * @param {T & object} objA
 * @param {R & object} objB
 * @param {Set<keyof R>} whitelist
 * @returns {(() => void)} Cleanup function to remove proxy.
 */
export function proxyProperties(objA, objB, whitelist) {
	const proto = Object.getPrototypeOf(objA);
	const newProto = Object.create(proto);

	function warnIfTargetDeclaredProp(target, prop) {
		if (Reflect.has(target, prop)) {
			const targetName = objA.constructor?.name ?? objA.name;
			const proxyName = objB.constructor?.name ?? objB.name;
			console.warn(
				`[vds]: ${targetName} declared a property [\`${prop}\`] that is being proxied to ${proxyName}.`
			);
		}
	}

	whitelist.forEach((prop) => {
		warnIfTargetDeclaredProp(objA, prop);
	});

	const proxy = new Proxy(newProto, {
		get(target, prop) {
			if (whitelist.has(/** @type {any} */ (prop))) {
				return Reflect.get(objB, prop, objB);
			}

			return Reflect.get(target, prop, objA);
		},
		set(target, prop, value) {
			if (whitelist.has(/** @type {any} */ (prop))) {
				return Reflect.set(objB, prop, value, objB);
			}

			return Reflect.set(target, prop, value, objA);
		}
	});

	Object.setPrototypeOf(objA, proxy);

	return () => {
		let currentProto = objA;

		// Find the constructor in the proto chain for which the next prototype is the proxy we set.
		while (currentProto && Object.getPrototypeOf(currentProto) !== proxy) {
			currentProto = Object.getPrototypeOf(currentProto);
		}

		// If we find the proxy we set then remove it from the chain by skipping over it.
		if (currentProto) {
			Object.setPrototypeOf(
				currentProto,
				Object.getPrototypeOf(Object.getPrototypeOf(currentProto))
			);
		}
	};
}
