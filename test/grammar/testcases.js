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
        expectedTransform: (values) => values.split(""),
        cases: [
            Case("<==text==>\n<==>", { name: "InkText", values: "" }),
            Case("<==text==>\n<==>", { name: "InkText", values: "" }),
            Case("<==text>\n<==>", { name: "InkText", values: "" }),
            Case("<==t==>\n<==>", { name: "InkText", values: "" }),
            Case("<==t>\n<==>", { name: "InkText", values: "" }),
            Case("<==t>\n\\<==>\n<==>", { name: "InkText", values: "<==>\n" }),
            Case("<==t>\<==>\n<==>", "fail"),
            Case("<==t>\n\<==><==>", "fail"),
            Case("<==text==>\nHello world\n<==>", { name: "InkText", values: "Hello world\n" }),
            Case("<==text==>\n <Hello> &world\n<==>", { name: "InkText", values: " <Hello> &world\n"}),
            Case("<==text==>\n\\<Hello> &world\n<==>", { name: "InkText", values: "<Hello> &world\n" }),
            Case("<==text==>\nHello\n\n\nworld\n<==>", { name: "InkText", values: "Hello\n\n\nworld\n" }),
            Case("<==text==><==>", "fail"),
            Case("<=text==>\n<==>", "fail"),
            Case("<=text==>\n<==><==>", "fail"),
            Case("<text==>\n<==>", "fail"),
            Case("<==text==>\n<=>", "fail"),
            Case("<==text==>\n<>", "fail"),
            Case("<==text==>\n\\<>\n<==>", { name: "InkText", values: "<>\n" }),
            Case("<==text==>\n___\n<==>", { name: "InkText", values: "___\n" }),
            Case("<==text==>\n[]\n<==>", { name: "InkText", values: "[]\n" }),
            Case("<==text==>\n{}\n<==>", { name: "InkText", values: "{}\n" }),
            Case("<==text==>\n\\\\\n<==>", { name: "InkText", values: "\\\\\n" }),
        ]
    });

testCases.set("HtmlBlock",
    {
        rule: "HtmlBlock", 
        actualTransform: (values) => values,
        expectedTransform: (values) => values.split(""),
        cases: [
            Case("<==html==>\n<==>", { name: "HtmlBlock", values: "" }),
            Case("<==html==>\n<==>", { name: "HtmlBlock", values: "" }),
            Case("<==html==>\n<==>", { name: "HtmlBlock", values: "" }),
            Case("<==html>\n<==>", { name: "HtmlBlock", values: "" }),
            Case("<==h==>\n<==>", { name: "HtmlBlock", values: "" }),
            Case("<==h>\n<==>", { name: "HtmlBlock", values: "" }),
            Case("<==h>\n\\<==>\n<==>", { name: "HtmlBlock", values: "<==>\n" }),
            Case("<==h>\<==>\n<==>", "fail"),
            Case("<==h>\n\<==><==>", "fail"),
            Case("<==html==>\n\\<div></div>\n<==>", { name: "HtmlBlock", values: "<div></div>\n" }),
            Case("<==html==>\n\\<Hello> &world\n<==>", { name: "HtmlBlock", values: "<Hello> &world\n"}),
            Case("<==html==>\n <Hello> &world\n<==>", { name: "HtmlBlock", values: " <Hello> &world\n"}),
            Case("<==html==>\n\\<Hello> &world\n<==>", { name: "HtmlBlock", values: "<Hello> &world\n" }),
            Case("<==html==>\nHello\n\n\nworld\n<==>", { name: "HtmlBlock", values: "Hello\n\n\nworld\n" }),
            Case("<==html==><==>", "fail"),
            Case("<=html==>\n<==>", "fail"),
            Case("<=html==>\n<==><==>", "fail"),
            Case("<html==>\n<==>", "fail"),
            Case("<==html==>\n<=>", "fail"),
            Case("<==html==>\n<>", "fail"),
            Case("<==html==>\n\\<>\n<==>", { name: "HtmlBlock", values: "<>\n" }),
            Case("<==html==>\n___\n<==>", { name: "HtmlBlock", values: "___\n" }),
            Case("<==html==>\n[]\n<==>", { name: "HtmlBlock", values: "[]\n" }),
            Case("<==html==>\n{}\n<==>", { name: "HtmlBlock", values: "{}\n" }),
            Case("<==html==>\n\\\\\n<==>", { name: "HtmlBlock", values: "\\\\\n" }),
        ]
    });

testCases.set("ParsedPassage", 
    { 
        rule: "Expression",
        actualTransform: (values) => values,
        expectedTransform: (values) => values.split(""),
        cases: [
            Case(`
                    first line
                    second line (with link) [[link\\_name -> passage\\_name]]
                    \n<==text==>
                    Ink source text goes here:
                    * choice 1
                    * choice 2
                    * choice 3 [] 
                    - gather 
                    <> and glue.
                    \n<==>
                    abc
                `,
                    { name: "ParsedPassage" }
            ),
            Case(`
                    first line
                    second line (with link) [[link\\_name -> passage\\_name]]
                    \n<==html==>
                        <div class='test'>
                            <a href='javascript:void(0)'></a>
                        </div>
                    \n<==>
                    abc
                `,
                    { name: "ParsedPassage" }
            ),
            Case(`
                    first line
                    second line (with link) [[link\\_name -> passage\\_name]]
                    \n<==html==>
                        <div class='test'>
                            <a href='javascript:void(0)'></a>
                        </div>
                    \n<==>
                    abc
                    \n<==text==>
                    Ink source text goes here:
                    * choice 1
                    * choice 2
                    * choice 3 [] 
                    - gather 
                    <> and glue.
                    \n<==>
                    \n<==html==>
                        <div class='test'>
                            <a href='javascript:void(0)'></a>
                        </div>
                    \n<==>
                    def
                `,
                    { name: "ParsedPassage" }
            )

        ]
    });

module.exports = testCases;