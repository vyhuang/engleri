/* The MIT License (MIT) Copyright (c) 2025 Vincent H. */

{{
class ParsedPassage {
	// includes:	string[]
	// contents:		ParsedObject[]
	constructor(includes, contents) {
		includes ??= [];
		contents ??= [];

		this.includes = includes;
		this.contents = contents;
		this.typeName = "ParsedPassage";
	}
}

class ParsedObject {
	// typeName: 	string
	// values: 		(ParsedObject | string)[]
	// reduce:		(arg: (ParsedObject | string)[]) => string
	constructor(typeName, values, reduce) {
		typeName ??= "";
		values ??= [];
		reduce ??= function(parsedObjects) {

			let values = parsedObjects.map(function(object) {
					return (typeof object === "string") ? object : object.render();
				});

			return values.join("");
		};

		this.typeName = typeName;
		this.values = values;
		this.reduce = reduce;
	}

	render() {
		return this.reduce(this.values);
	}
}

class Link extends ParsedObject {
	constructor(values) {
    	super(
			"link", 
			values, 
			function (textValues) {
				// we know these values are text objects.
				let renderedTextValues = textValues.map((value) => value.render());
				let label = renderedTextValues[0];
				let dest = renderedTextValues[1];

				return `<tw-link data-passage="${dest.trim()}">${label.trim()}</tw-link>`;
			});
    }
}

}}

Expression = _nls chunks:(InkText / HtmlBlock / mixedLine)* _nls _eol
	{
		let includes = null;

		let inkTextCount = 0;
		chunks.forEach((chunk) => {
			if (chunk.typeName === "InkText") {
				inkTextCount += 1;
			}
		})

		if (inkTextCount > 1) {
			throw new Error("There shouldn't be more than one InkText block in a passage!");
		}

		return new ParsedPassage([], chunks);
	}

// Passage block chars

_passageLine = c1:("\\<" { return "<"; } / [^<]) c2:[^\r\n]* c3:(_nl { return "\n"; })
	{ 
    	let result = [];
        if (c1) {
        	result.push(c1);
        }
        if (c2) {
        	result.push(c2);
        }
        if (c3) {
        	result.push(c3);
        }
		return result;
    }
_passageEnd = "<==>" _eol

// Passage block definition: Ink text

InkText = _inkTextStart _eol lines:_passageLine* _passageEnd _nls
	{
		const toHtml = () => "<div id='ink_block'></div>\n"
		return new ParsedObject("InkText", lines.flat(Infinity), toHtml);
	}

_inkTextStart = "<==text==>" / "<==text>" / "<==t==>" / "<==t>" 

// Passage block definition: html

HtmlBlock = _htmlStart _eol lines:_passageLine* _passageEnd _nls
	{
		return new ParsedObject("HtmlBlock", lines.flat(Infinity));
	}
	
_htmlStart = "<==html==>" / "<==html>" / "<==h==>" / "<==h>"

// mixedLine 

mixedLine = contents:( pureText / link )+ nls:_nls 
	{ 
		const toHtml = function (values) {
			let contents = values[0];
			let newlines = values[1];

			let pText =  `<p>${contents.map((o)=>o.render()).join("")}</p>`;
			let brText = `${newlines.map((o)=>o.render()).join("")}`;

			return `${pText}\n${brText}`
		};

		return new ParsedObject("mixedLine", [contents, [nls]], toHtml)
	}

// link

link = _wrappedLink / _twLink

_wrappedLink = "<[[" label:pureText destination:("|" dest:pureText { return dest; })? "]]>"
	{
		let dest = destination ? destination : label;

		return new Link([label, dest]);
	}
_twLink = "[[" value:(_inner_link_lr / _inner_link_rl / _inner_link_simple) "]]" 
	{ return new Link(value); }

_inner_link_simple = labelAndDest:pureText
	{ return [labelAndDest, labelAndDest]; }
_inner_link_lr = label:pureText (_linkArrowRight / "|") destination:pureText
	{ return [label, destination]; }
_inner_link_rl = destination:pureText _linkArrowLeft label:pureText
	{ return [label, destination]; }

_linkArrowRight "->" = "->"
_linkArrowLeft "<-" = "<-"

// text
pureText = chars:(_charUnescaped / _charEscaped)+ 
	{ 
		return new ParsedObject("text", chars, (values) => values.join("").trimStart()); 
	}

_charUnescaped = (&(!_nonTextCharUnescaped !_linkArrowRight) char:. { return char; })
// every character EXCEPT the newline characters can be escaped.
_charEscaped = "\\"char:("<" / ">" / [^\r\n]) { return char; }

// '<', '>' (and their escaped equivalents) are used for format markup
// '|', '[', ']' are used for twine links
// '{', '}' are used for variable printing
// '\r' and '\n' are used for newlines (so we absolutely don't want to touch them)
// '_' is used for quick styling
// '\' is used for escaping characters
_nonTextCharUnescaped = [<>\|\[\]{}\r\n_\\] 

// whitespace
_eol "endOfLine" = _nl / _eof

_nl "newLine" = _ ([\r])?[\n]

_nls "blankLines" = lines:_nl*
	{ 
		const toHtml = (values) => {
			let count = values.length - 2;

			if (count > 0) {
				return "<br> \n".repeat(count);
			} else {
				return "";
			}

		}
		return new ParsedObject("newlines", lines, toHtml); 
	}

_eof "endOfFile" = _ !.

_ "inlineWS" = [ \t]*
