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
  tryParseJSON
} from '../network';

describe(tryParseJSON.name, function () {
  test('it should return obj given valid JSON', function () {
    const expected = { a: 'apples', b: 'bees', c: 'chicken' };
    const result = tryParseJSON(JSON.stringify(expected));
    expect(result).to.eql(expected);
  });

  test('it should return undefined given invalid JSON', function () {
    const result = tryParseJSON('invalid json');
    expect(result).to.be.undefined;
  });
});

describe(isObjOrJSON.name, function () {
  test('it should return true given an object', function () {
    expect(isObjOrJSON({})).to.be.true;
  });

  test('it should return true given JSON', function () {
    expect(isObjOrJSON(JSON.stringify({ a: 'apples' }))).to.be.true;
  });

  test('it should return false given non-object', function () {
    expect(isObjOrJSON(null)).to.be.false;
    expect(isObjOrJSON(undefined)).to.be.false;
    expect(isObjOrJSON('')).to.be.false;
    expect(isObjOrJSON(true)).to.be.false;
    expect(isObjOrJSON(0)).to.be.false;
  });
});

describe(objOrParseJSON.name, function () {
  test('it should return immediately given an object', function () {
    const expected = { a: 'apples', b: 'bees' };
    expect(objOrParseJSON(expected)).to.eql(expected);
  });

  test('it should return obj given JSON', function () {
    const expected = { a: 'apples', b: 'bees' };
    expect(objOrParseJSON(JSON.stringify(expected))).to.eql(expected);
  });

  test('it should return undefined given non-object or JSON', function () {
    expect(objOrParseJSON(null)).to.be.undefined;
    expect(objOrParseJSON(undefined)).to.be.undefined;
    expect(objOrParseJSON('')).to.be.undefined;
    expect(objOrParseJSON(true)).to.be.undefined;
    expect(objOrParseJSON(0)).to.be.undefined;
  });
});

describe(decodeJSON.name, function () {
  test('it should return object given valid JSON', function () {
    const expected = { a: 'apples', b: 'bees' };
    expect(decodeJSON(JSON.stringify(expected))).to.eql(expected);
  });

  test('it should return undefined given invalid JSON', function () {
    expect(decodeJSON('invalid json')).to.be.undefined;
  });
});

describe(tryDecodeURIComponent.name, function () {
  test('it should return decoded component given valid component', function () {
    expect(tryDecodeURIComponent('apple%40bees.com')).to.equal(
      'apple@bees.com'
    );
  });

  test('it should return fallback given window.decodeURIComponent is undefined', function () {
    // @ts-expect-error
    window.decodeURIComponent = undefined;
    expect(tryDecodeURIComponent('', 'apples')).to.equal('apples');
  });

  test('it should return fallback given window is undefined', function () {
    expect(tryDecodeURIComponent('', 'apples', false)).to.equal('apples');
  });
});

describe(parseQueryString.name, function () {
  test('it should return valid key/value map given query string', function () {
    expect(parseQueryString('apples=1&apples=2&bees=wombo')).to.eql({
      apples: ['1', '2'],
      bees: 'wombo'
    });
  });

  test('it should return empty object given undefined', function () {
    expect(parseQueryString(undefined)).to.eql({});
  });

  test('it should return valid key/value map given simple query string', function () {
    expect(parseQueryString('apples')).to.eql({ apples: '' });
  });
});

describe(serializeQueryString.name, function () {
  test('it should serialize object into query string', function () {
    expect(
      serializeQueryString({
        apples: ['1', '2'],
        bees: 'wombo',
        chicken: null,
        dips: undefined
      })
    ).to.equal('apples=1&apples=2&bees=wombo');
  });
});

describe(preconnect.name, function () {
  test('it should append link to document head', function () {
    const url = 'https://example.com';

    preconnect(url);

    const link = document.head.querySelector(
      `link[href="${url}"]`
    ) as HTMLLinkElement;

    expect(link.rel).to.equal('preconnect');
  });

  test('it should return false given window is undefined', function () {
    const url = 'https://example.com';
    const didPreconnect = preconnect(url, 'preconnect', false);
    expect(didPreconnect).to.be.false;
  });
});

describe(appendParamsToURL.name, function () {
  test('it should append param string as query string to url', function () {
    expect(appendParamsToURL('https://example.com', 'param=1')).to.equal(
      'https://example.com?param=1'
    );
  });

  test('it should append params as query string to url', function () {
    expect(
      appendParamsToURL('https://example.com', {
        apples: ['1', '2'],
        bees: 'wombo'
      })
    ).to.equal('https://example.com?apples=1&apples=2&bees=wombo');
  });

  test('it should return url given empty params', function () {
    expect(appendParamsToURL('https://apples.com', {})).to.equal(
      'https://apples.com'
    );
  });

  test('it should append params successfully given url already has query string', function () {
    expect(
      appendParamsToURL('https://example.com?chicken=3', {
        apples: ['1', '2'],
        bees: 'wombo'
      })
    ).to.equal('https://example.com?chicken=3&apples=1&apples=2&bees=wombo');
  });
});

describe(decodeQueryString.name, function () {
  test('it should return undefined given non-string', function () {
    // @ts-expect-error
    expect(decodeQueryString(100)).to.eql(undefined);
  });

  test('it should return object given query string', function () {
    expect(decodeQueryString('apples=1&apples=2&bees=wombo')).to.eql({
      apples: ['1', '2'],
      bees: 'wombo'
    });
  });
});
