import { createContext } from '../context';
import { consumeContext } from '../decorators';

const testContext = createContext(10);

class Apples {
	@consumeContext(testContext) context = testContext.initialValue;
}

describe('context/decorators', function () {
	it('s', function () {
		const a = new Apples();
		//
	});
});
