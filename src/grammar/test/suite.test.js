const testcases = require('./testcases');
const parser = require('../passage_test');

test('pureText', () => {
  runSuite(testcases, "pureText");
})

test('blankLines', () => {
  runSuite(testcases, "blankLines", (values) => values.length);
})

test('links', () => {
  runSuite(testcases, "links");
})

test('mixedLine', () => {
  runSuite(testcases, "mixedLine");
})


function runSuite(testcases, testSuiteName, valuesTransform) {
  valuesTransform ??= (values) => values;

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
          expect(valuesTransform(actualResult.values)).toStrictEqual(element.expected.values);
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

/*
beforeEach(() => {
});

afterEach(() => {
});
*/