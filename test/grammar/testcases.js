/* The MIT License (MIT) Copyright (c) 2025 Vincent H.  */

class TestCase {
    constructor(testcase, expectedValue, expectError=false) {
        this.case = testcase;
        this.expected = expectedValue;
        this.expectError = expectError;
    }
}

function Case(testcase, expectedValue) {
    if (expectedValue === "fail") {
        return new TestCase(testcase, null, true);
    }
    return new TestCase(testcase, expectedValue);
}

const testCases = new Map();

testCases.set("blankLines", 
    {
        rule: "_nls",
        actualTransform: (values) => values.length,
        expectedTransform: (values) => values,
        cases: [
            Case("  ", "fail"),
            Case("  \t\n", { name: "newlines", values: 1, render: ""}),
            Case("  \t\n\n", { name: "newlines", values: 2, render: ""}),
            Case("  \t\n\n\n", { name: "newlines", values: 3, render: "<br> \n"}),
            Case("  \t\n\n\n\n", { name: "newlines", values: 4, render: "<br> \n<br> \n"})
        ]
    });

testCases.set("pureText", 
    {
        rule: "pureText",
        actualTransform: (values) => values,
        expectedTransform: (values) => values,
        cases: [
            Case("Hello world", 
                { name: "text", values: "Hello world".split(""), render: "Hello world"}),
            Case("\\H\\e\\l\\l\\o world", 
                { name: "text", values: "Hello world".split(""), render: "Hello world" }),
            Case("\\H\\e\\l\\l\\o <world", "fail"),
            Case("\\H\\e\\l\\l\\o \\<world", 
                { name: "text", values: "Hello <world".split(""), render: "Hello <world" }),
            Case("\\H\\e\\l\\l\\o >world", "fail"),
            Case("\\H\\e\\l\\l\\o \\>world", 
                { name: "text", values: "Hello >world".split(""), render: "Hello >world" }),
            Case("\\H\\e\\l\\l\\o \\\n", "fail"), 
        ]
    });

testCases.set("links", 
    {
        rule: "link",
        actualTransform: (values) => values,
        expectedTransform: (values) => values,
        cases: [
            Case("<[[abc ]]>", 
                { name: "link", values: null, render: "<tw-link data-passage=\"abc\">abc</tw-link>" }),
            Case("<[[abc def | ghi ]]>", 
                { name: "link", values: null, render: "<tw-link data-passage=\"ghi\">abc def</tw-link>" }),
            Case("<[[abc def -> ghi ]]>", "fail"),
            Case("<[[abc def <- ghi ]]>", "fail"),
            Case("[[abc ]]", 
                { name: "link", values: null, render: "<tw-link data-passage=\"abc\">abc</tw-link>" }),
            Case("[[abc def | ghi ]]", 
                { name: "link", values: null, render: "<tw-link data-passage=\"ghi\">abc def</tw-link>" }),
            Case("[[abc def -> ghi ]]", 
                { name: "link", values: null, render: "<tw-link data-passage=\"ghi\">abc def</tw-link>" }),
            Case("[[abc def <- ghi ]]", 
                { name: "link", values: null, render: "<tw-link data-passage=\"abc def\">ghi</tw-link>" }),
            Case("[[abc \\d\\e\\f <- ghi ]]", 
                { name: "link", values: null, render: "<tw-link data-passage=\"abc def\">ghi</tw-link>" }),
            Case("[[abc def[] <- ghi{} ]]", "fail"),
            Case("[[abc def\\[\\] <- ghi\\{\\} ]]", 
                { name: "link", values: null, render: "<tw-link data-passage=\"abc def[]\">ghi{}</tw-link>" }),
        ]
    });

testCases.set("mixedLine",
    {
        rule: "mixedLine",
        actualTransform: (values) => values,
        expectedTransform: (values) => values,
        cases: [
            Case("Hello world", { name: "mixedLine", values: null, render: "<p>Hello world</p>\n"}),
            Case("Hello [[world|second passage]]", 
                { 
                    name: "mixedLine", 
                    values: null, 
                    render: "<p>Hello <tw-link data-passage=\"second passage\">world</tw-link></p>\n"
                }),
            Case("Hello [[world->second passage]]!!!", 
                { 
                    name: "mixedLine", 
                    values: null, 
                    render: "<p>Hello <tw-link data-passage=\"second passage\">world</tw-link>!!!</p>\n"
                }),
            Case("Hello [[world->second passage]]!!! ([[???->third-passage]])", 
                { 
                    name: "mixedLine", 
                    values: null, 
                    render: "<p>Hello <tw-link data-passage=\"second passage\">world</tw-link>!!! (<tw-link data-passage=\"third-passage\">???</tw-link>)</p>\n"
                }),
            Case("Hello [[world->second passage]]\n\n", 
                { 
                    name: "mixedLine", 
                    values: null, 
                    render: "<p>Hello <tw-link data-passage=\"second passage\">world</tw-link></p>\n"
                }),
            Case("Hello [[world->second passage]]\n\n\n", 
                { 
                    name: "mixedLine", 
                    values: null, 
                    render: "<p>Hello <tw-link data-passage=\"second passage\">world</tw-link></p>\n<br> \n"
                }),
        ]
    });

testCases.set("InkText", 
    { 
        rule: "InkText", 
        actualTransform: (values) => values,
        expectedTransform: (values) => values,
        cases: [
            Case("<==text==><==>", { name: "InkText", values: "" }),
            Case("<==text==><==>", { name: "InkText", values: "" }),
            Case("<==text><==>", { name: "InkText", values: "" }),
            Case("<==t==><==>", { name: "InkText", values: "" }),
            Case("<==t><==>", { name: "InkText", values: "" }),
            Case("<==text==>Hello world<==>", { name: "InkText", values: "Hello world" }),
            Case("<==text==><Hello> &world<==>", "fail"),
            Case("<==text==>\\<Hello> &world<==>", { name: "InkText", values: "<Hello> &world" }),
            Case("<==text==>Hello\n\n\nworld<==>", { name: "InkText", values: "Hello\n\n\nworld" }),
            Case("<=text==><==>", "fail"),
            Case("<text==><==>", "fail"),
            Case("<==text==><=>", "fail"),
            Case("<==text==><>", "fail"),
            Case("<==text==>\\<><==>", { name: "InkText", values: "<>" }),
            Case("<==text==>___<==>", { name: "InkText", values: "___" }),
            Case("<==text==>[]<==>", { name: "InkText", values: "[]" }),
            Case("<==text==>{}<==>", { name: "InkText", values: "{}" }),
            Case("<==text==>\\\\<==>", { name: "InkText", values: "\\\\" }),
        ]
    });

module.exports = testCases;