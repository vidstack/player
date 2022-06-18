import {
  camelToKebabCase,
  camelToTitleCase,
  kebabToCamelCase,
  kebabToPascalCase,
  kebabToTitleCase,
} from './string';

describe(camelToKebabCase.name, () => {
  it('should convert to kebab-case', () => {
    expect(camelToKebabCase('myProperty')).to.equal('my-property');
    expect(camelToKebabCase('myLongProperty')).to.equal('my-long-property');
  });
});

describe(camelToTitleCase.name, () => {
  it('should convert to Title Case', () => {
    expect(camelToTitleCase('myProperty')).to.equal('My Property');
    expect(camelToTitleCase('myLongProperty')).to.equal('My Long Property');
  });
});

describe(kebabToTitleCase.name, () => {
  it('should convert to Title Case', () => {
    expect(kebabToTitleCase('my-property')).to.equal('My Property');
    expect(kebabToTitleCase('my-long-property')).to.equal('My Long Property');
  });
});

describe(kebabToCamelCase.name, () => {
  it('should convert to camelCase', () => {
    expect(kebabToCamelCase('my-property')).to.equal('myProperty');
    expect(kebabToCamelCase('my-long-property')).to.equal('myLongProperty');
  });
});

describe(kebabToPascalCase.name, () => {
  it('should convert to PascalCase', () => {
    expect(kebabToPascalCase('my-property')).to.equal('MyProperty');
    expect(kebabToPascalCase('my-long-property')).to.equal('MyLongProperty');
  });
});
