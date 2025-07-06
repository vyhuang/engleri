/* The MIT License (MIT) Copyright (c) 2025 Vincent H. */

{{
class ParsedObject {
	// typeName: 	string
	// values: 		(ParsedObject | string)[]
	// reduceToHtml:(ParsedObject | string)[] => string
	constructor(typeName, values, reduceToHtml) {
		typeName ??= "";
		values ??= [];
		reduceToHtml ??= function(parsedObjects) {

			let values = parsedObjects.map(function(object) {
					return (typeof object === "string") ? object : object.render();
				});

			return values.join("");
		};

		this.typeName = typeName;
		this.values = values;
		this.reduceToHtml = reduceToHtml;
	}

	render() {
		return this.reduceToHtml(this.values);
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

Expression = lines:mixedLine+ _eol 
	{ 
		return new ParsedObject("lines", lines);
	}

// Passage section definition: Ink text

InkText = _inkTextStart inkTextChars:((!_inkTextEnd) $(.*)) _inkTextEnd _eol
	{
		const domParser = new DOMParser();
		const toHtml = function(values) {

			let joinedText = values.join("");

			// now we want to unescape this.
			let doc = domParser.parseFromString(input, "text/html"); 
			return doc.documentElement.textContent;
		}
		return new ParsedObject("inkText", inkTextChars, toHtml);
	}

_inkTextStart = _angleBracketLeft ("==text==" / "==text" / "==t==" / "==t" ) _angleBracketRight
_inkTextEnd = ( _angleBracketLeft "==" _angleBracketRight )

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

_wrappedLink = _angleBracketLeft"[[" label:pureText destination:("|" dest:pureText { return dest; })? "]]"_angleBracketRight 
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
_charEscaped = "\\"char:(_angleBracketLeft / _angleBracketRight / [^\r\n]) { return char; }

// '<', '>' (and their escaped equivalents) are used for format markup
// '|', '[', ']' are used for twine links
// '{', '}' are used for variable printing
// '\r' and '\n' are used for newlines (so we absolutely don't want to touch them)
// '_' is used for quick styling
// '\' is used for escaping characters
_nonTextCharUnescaped = _angleBracketLeft / _angleBracketRight / [\|\[\]{}\r\n_\\] 

_angleBracketLeft "<" = "<"
_angleBracketRight ">" = ">"

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

_eof "endOfFile" = !.

_ "inlineWS" = [ \t]*
