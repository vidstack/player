import { expect } from '@open-wc/testing';
import {
  appendParamsToURL,
  decodeJSON,
  decodeQueryString,
  isObjOrJSON,
  objOrParseJSON,
  parseQueryString,
  preconnect,
  serializeQueryString,
  tryDecodeURIComponent,
  tryParseJSON,
} from '../network';

describe('tryParseJSON', () => {
  it('should return obj given valid JSON', () => {
    const expected = { a: 'apples', b: 'bees', c: 'chicken' };
    const result = tryParseJSON(JSON.stringify(expected));
    expect(result).to.eql(expected);
  });

  it('should return undefined given invalid JSON', () => {
    const result = tryParseJSON('invalid json');
    expect(result).to.be.undefined;
  });
});

describe('isObjOrJSON', () => {
  it('should return true given an object', () => {
    expect(isObjOrJSON({})).to.be.true;
  });

  it('should return true given JSON', () => {
    expect(isObjOrJSON(JSON.stringify({ a: 'apples' }))).to.be.true;
  });

  it('should return false given non-object', () => {
    expect(isObjOrJSON(null)).to.be.false;
    expect(isObjOrJSON(undefined)).to.be.false;
    expect(isObjOrJSON('')).to.be.false;
    expect(isObjOrJSON(true)).to.be.false;
    expect(isObjOrJSON(0)).to.be.false;
  });
});

describe('objOrParseJSON', () => {
  it('should return immediately given an object', () => {
    const expected = { a: 'apples', b: 'bees' };
    expect(objOrParseJSON(expected)).to.eql(expected);
  });

  it('should return obj given JSON', () => {
    const expected = { a: 'apples', b: 'bees' };
    expect(objOrParseJSON(JSON.stringify(expected))).to.eql(expected);
  });

  it('should return undefined given non-object or JSON', () => {
    expect(objOrParseJSON(null)).to.be.undefined;
    expect(objOrParseJSON(undefined)).to.be.undefined;
    expect(objOrParseJSON('')).to.be.undefined;
    expect(objOrParseJSON(true)).to.be.undefined;
    expect(objOrParseJSON(0)).to.be.undefined;
  });
});

describe('decodeJSON', () => {
  it('should return object given valid JSON', () => {
    const expected = { a: 'apples', b: 'bees' };
    expect(decodeJSON(JSON.stringify(expected))).to.eql(expected);
  });

  it('should return undefined given invalid JSON', () => {
    expect(decodeJSON('invalid json')).to.be.undefined;
  });
});

describe('tryDecodeURIComponent', () => {
  it('should return decoded component given valid component', () => {
    expect(tryDecodeURIComponent('apple%40bees.com')).to.equal(
      'apple@bees.com',
    );
  });

  it('should return fallback given window is undefined', () => {
    (window as any).decodeURIComponent = undefined;
    expect(tryDecodeURIComponent('', 'apples')).to.equal('apples');
  });
});

describe('parseQueryString', () => {
  it('should return valid key/value map given query string', () => {
    expect(parseQueryString('apples=1&apples=2&bees=wombo')).to.eql({
      apples: ['1', '2'],
      bees: 'wombo',
    });
  });

  it('should return empty object given undefined', () => {
    expect(parseQueryString(undefined)).to.eql({});
  });
});

describe('serializeQueryString', () => {
  it('should serialize object into query string', () => {
    expect(
      serializeQueryString({
        apples: ['1', '2'],
        bees: 'wombo',
        chicken: null as any,
        dips: undefined as any,
      }),
    ).to.equal('apples=1&apples=2&bees=wombo');
  });
});

describe('prefetch', () => {
  it('should append link to document head', () => {
    const url = 'https://example.com';
    preconnect(url);
    const link = document.head.querySelector(
      `link[href="${url}"]`,
    ) as HTMLLinkElement;
    expect(link.rel).to.equal('preconnect');
  });
});

describe('appendParamsToURL', () => {
  it('should append params as query string to url', () => {
    expect(
      appendParamsToURL('https://example.com', {
        apples: ['1', '2'],
        bees: 'wombo',
      }),
    ).to.equal('https://example.com?apples=1&apples=2&bees=wombo');
  });

  it('should return url given empty params', () => {
    expect(appendParamsToURL('https://apples.com', {})).to.equal(
      'https://apples.com',
    );
  });

  it('should append params successfully given url already has query string', () => {
    expect(
      appendParamsToURL('https://example.com?chicken=3', {
        apples: ['1', '2'],
        bees: 'wombo',
      }),
    ).to.equal('https://example.com?chicken=3&apples=1&apples=2&bees=wombo');
  });
});

describe('decodeQueryString', () => {
  it('should return object given query string', () => {
    expect(decodeQueryString('apples=1&apples=2&bees=wombo')).to.eql({
      apples: ['1', '2'],
      bees: 'wombo',
    });
  });
});
