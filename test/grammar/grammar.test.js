/* The MIT License (MIT) Copyright (c) 2025 Vincent H. */

const testcases = require('./testcases');
const parser = require('../../src/grammar/passage_test');

describe('rules', () => {
  beforeEach(() => { });

  afterEach(() => { });

  test('pureText', () => {
    runSuite(testcases, "pureText");
  })

  test('blankLines', () => {
    runSuite(testcases, "blankLines");
  })

  test('links', () => {
    runSuite(testcases, "links");
  })

  test('mixedLine', () => {
    runSuite(testcases, "mixedLine");
  })

  test('InkText', () => {
    runSuite(testcases, "InkText");
  })

  test('HtmlBlock', () => {
    runSuite(testcases, "HtmlBlock");
  })

  test('Passage', () => {
    runSuite(testcases, "ParsedPassage");
  })

})

function runSuite(testcases, testSuiteName) {

  let testSuite = testcases.get(testSuiteName);
  let currentCase = null;

  testSuite.cases.forEach((element) => {
    currentCase = element.case;

    let htmlEscaped = false;
    try {
      if (element.expectError) {
        expect(() => {
          parser.parse(currentCase, { startRule: testSuite.rule });
        }).toThrow();
      } else {
        checkValuesAndRender(currentCase, testSuite.rule, element.expected, testSuite);
      }
    } catch (err) {
      throw new Error(`Testcase '${currentCase}' failed: ${err}`);
    }
  });
}

function checkValuesAndRender(currentCase, startRule, expected, testSuite) {

  // values transform to expected result
  let actualResult = parser.parse(currentCase, { startRule: startRule })

  expect(actualResult.typeName).toStrictEqual(expected.name);
  if (expected.values) {
    expect(testSuite.actualTransform(actualResult.values))
      .toStrictEqual(testSuite.expectedTransform(expected.values));
  }

  // render() result is as expected
  if (expected.render) {
    let renderedResult = actualResult.render();
    expect(renderedResult).toBe(expected.render);
  }
}
