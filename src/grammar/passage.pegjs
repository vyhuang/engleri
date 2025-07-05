{{
class ParsedObject {
	constructor(typeName, value, toHtml) {
    	if (typeName) {
			this.typeName = typeName;
        }
		if (value != undefined && value != null) {
			this.value = value; // ParsedObject
		}
		if (toHtml) {
			this.toHtml = toHtml;
		} else {
			this.toHtml = () => {
				if (value instanceof ParsedObject) {
					return value.toHtml;
				}
				return value;
			}
		}
	}
}

class Link extends ParsedObject {
	constructor(value) {
		let dest = value[1].value;
		let label = value[0].value;

    	super(null, value, () => `<tw-link data-passage="${dest}">${label}</tw-link>`);
    }
}
}}

Expression = lines:textLinkLine+ _eol 
{ 
	return lines;
}

textLinkLine = contents:( pureText / link )+ nls:_nls { 

		let values = [contents, nls].flat(Infinity);

		const toHtml = () => {
			let lineContents = values.map((element) => {
				if (element instanceof ParsedObject) {
					return element.toHtml();
				}

				return element;
			})

			return `<p>${lineContents.join("")}</p>`
		};

		return new ParsedObject("line", values, toHtml)
	}

// link

link = _wrappedLink / _twLink

_wrappedLink = "<[["label:pureText "|" destination:pureText "]]>" 
	{ return new Link([label, destination]); }
_twLink = "[[" value:(_inner_link_lr / _inner_link_rl) "]]" 
	{ return new Link(value); }

_inner_link_lr = label:pureText (_linkArrowRight / "|") destination:pureText
	{ return [label, destination]; }
_inner_link_rl = destination:pureText _linkArrowLeft label:pureText
	{ return [label, destination]; }

_linkArrowRight "->" = "->" / "-&gt;"
_linkArrowLeft "<-" = "<-" / "&lt;-"

// text
pureText = text:(_charUnescaped / _charEscaped)+ 
	{ 
		return new ParsedObject("text", text.join("").trimStart()); 
	}

_charUnescaped = (&(!_nonTextCharUnescaped !(_linkArrowRight)) char:. { return char; })
_charEscaped = "\\"char:(_angleBracketLeft / _angleBracketRight / [^\n]) { return char; }

_nonTextCharUnescaped = _angleBracketLeft / _angleBracketRight / [\r\n_\\\[\]\|]
_angleBracketLeft "<" = ("&lt;" / "<")
_angleBracketRight ">" = ("&gt;" / ">")

// whitespace
_eol "endOfLine" = _nl / _eof

_nl "newLine" = _ ([\r])?[\n]

_nls "blankLine" = lines:_nl*
	{ 
		const toHtml = () => lines.map(() => "<br>").join("");
		return new ParsedObject("newlines", lines.length, toHtml); 
	}

_eof = !.

_ "inlineWS" = [ \t]*
