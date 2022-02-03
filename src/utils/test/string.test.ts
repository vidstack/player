import { camelToKebabCase } from '../string';

describe(camelToKebabCase.name, () => {
  it('should convert to kebab-case', () => {
    expect(camelToKebabCase('myProperty')).to.equal('my-property');
    expect(camelToKebabCase('myLongProperty')).to.equal('my-long-property');
  });
});
