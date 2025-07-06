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

})

function runSuite(testcases, testSuiteName) {

  let testSuite = testcases.get(testSuiteName);
  let currentCase = null;
  try {
    testSuite.cases.forEach((element) => {
      currentCase = element.case;
      if (element.expectError) {
        expect(() => {
          parser.parse(currentCase, { startRule: testSuite.rule });
        }).toThrow();
      } else {
        // values transform to expected result
        let actualResult = parser.parse(currentCase, { startRule: testSuite.rule })
        expect(actualResult.typeName).toStrictEqual(element.expected.name);
        if (element.expected.values) {
          expect(testSuite.actualTransform(actualResult.values))
            .toStrictEqual(testSuite.expectedTransform(element.expected.values));
        }

        // render() result is as expected
        let renderedResult = actualResult.render();
        expect(renderedResult).toBe(element.expected.render);
      }
    });
  } catch (err) {
    throw new Error(`Testcase '${currentCase}' failed: ${err}`);
  }
}
