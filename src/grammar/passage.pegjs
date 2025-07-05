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
			"Link", 
			values, 
			function (textValues) {
				// we know these values are text objects.
				let renderedTextValues = textValues.map((value) => value.render());
				let label = renderedTextValues[0];
				let dest = renderedTextValues[1];

				return `<tw-link data-passage="${dest}">${label}</tw-link>`;
			});
    }
}

}}

Expression = lines:textLinkLine+ _eol 
	{ 
		return new ParsedObject("lines", lines);
	}

textLinkLine = contents:( pureText / link )+ nls:_nls 
	{ 
		const toHtml = function (values) {
			let contents = values[0];
			let newlines = values[1];

			let pText =  `<p>${contents.map((o)=>o.render()).join("")}</p>`;
			let brText = `${newlines.map((o)=>o.render()).join("")}`;

			return `${pText}${brText}`
		};

		return new ParsedObject("line", [contents, [nls]], toHtml)
	}

// link

link = _wrappedLink / _twLink

_twLink = "[[" value:(_inner_link_lr / _inner_link_rl) "]]" 
	{ return new Link(value); }
_wrappedLink = "<[["label:pureText "|" destination:pureText "]]>" 
	{ return new Link([label, destination]); }

_inner_link_lr = label:pureText (_linkArrowRight / "|") destination:pureText
	{ return [label, destination]; }
_inner_link_rl = destination:pureText _linkArrowLeft label:pureText
	{ return [label, destination]; }

_linkArrowRight "->" = "->" / "-&gt;"
_linkArrowLeft "<-" = "<-" / "&lt;-"

// text
pureText = chars:(_charUnescaped / _charEscaped)+ 
	{ 
		return new ParsedObject("text", chars, (values) => values.join("").trimStart()); 
	}

_charUnescaped = (&(!_nonTextCharUnescaped !_linkArrowRight) char:. { return char; })
_charEscaped = "\\"char:(_angleBracketLeft / _angleBracketRight / [^\n]) { return char; }

_nonTextCharUnescaped = _angleBracketLeft / _angleBracketRight / [\|\[\]\r\n_\\]
_angleBracketLeft "<" = ("&lt;" / "<")
_angleBracketRight ">" = ("&gt;" / ">")

// whitespace
_eol "endOfLine" = _nl / _eof

_nl "newLine" = _ ([\r])?[\n]

_nls "blankLine" = lines:_nl*
	{ 
		const toHtml = (values) => {
			let count = values.length - 2;

			if (count > 0) {
				return "<br> ".repeat(count);
			} else {
				return "";
			}

		}
		return new ParsedObject("newlines", lines, toHtml); 
	}

_eof "endOfFile" = !.

_ "inlineWS" = [ \t]*
