# engleri

## TODO:
- ~~Add specialized link annotation `<[[link_name|destination]]>`~~
- ~~Add basic newline support (see markup compilers?) [v0.1.1]~~
- ~~Cleanup current parsing code so it isn't a huge mess [v0.1.2]~~
- ~~Write basic tests for grammar & story/passage functionality~~

- [v0.2.x] Integrate inkjs & ink runtime into passage (basic functionality)
	- ~~[v0.2.0] Implement ink text 'section' syntax~~
		- ~~ink source `<==text==><==>`, `<==t><==>` (allowed once a passage)~~
	- ~~[v0.2.1] print lines of text into <p> blocks~~
		- ~~new lines should be printed when the passage is clicked~~
	- ~~[v0.2.2] add choice support~~
		- ~~choices should be numbered & plain lines of text (should look different than passage links)~~
	- ~~[v0.2.3] a symbol should be present at the bottom of the ink block when text is still available~~
	- ~~[v0.2.4] Define a 'default' ink-content passage (with pure HTML markup) and insert it into passage~~
	- [v0.2.5] Allow users to define their own ink-content passage (with pure HTML markup) and override default ink-content passage if present
	- [v0.2.6] Figure out state tracking 
		- game should constantly be tracking game state
			- this includes all of ink's tracking variables too!
			- this also means that passages should continue to display already-shown text (unless tagged otherwise)
				- (this might be possible through abusing the saveToJson/loadFromJson functionality the runtime has)
		- ink variables & state should be fully accessible & modifiable by the twine engine at all times
			- this theoretically allows for full out-of-ink support
	- [v0.2.7] Add basic variable insertion 
		- `<$var_name>` -- reactive insertion (the value can change after it's been shown) 
		- `{var_name}` -- static insertion (the value will not change after it's been shown)
			- obviously this is already supported in ink -- we want to support it in general passage markup.
	- [v0.2.8] Figure out basic 'settings' dialogue / button layout
	- [v0.2.9] Figure out saving / loading 

- [v0.3.x] Advanced styling
	- [v0.3.1] Add basic markup language `<@style(,style): >`. possible styles:
		- bold/b
		- italic/i
		- strikethrough/s
		- underline/u
		- superscript/sp
		- subscript/sb
		- code/cd
		- smallcaps/sc (?)
	- [v0.3.2] Add shortcut styling
		- `_italic text_`
		- `__bold text__`
		- `___bold italic text___`
	- [v0.3.3] Add css markup `<.class_name(,class_name): >` 
	- [v0.3.4] Add click-through sequences `<^seq_annotation(,seq_annotation)%% text (% (text))>` 
	- [v0.3.5] Add turn-through sequences `<&seq_annotation(,seq_annotation)%% text (% (text))>` 
	- [v0.3.6] Add basic block markup: 
			```
			<< (@style(,style);)(.class_name(,class_name);)
			TEXT 
			>>
			```
   	- [v0.3.7] Support 'glue' markup: `<>`
   	- [v0.3.8] Support 'br' markup: `<%>`

- [v0.4.0] Passage section headers: 
    - include declarations `<==include==><==>`, `<==i><==>`
        - signifies which passages' ink code should be loaded
        - must be at the top of the passage
        - only one section is allowed per passage
    ```
    <==include==>
    @passage_name
    #passage_tag
    <==>
    ```
    - state variable declarations `<==var==><==>`, `<==v><==>`
        - `~ var_name = <value>`
            - if variable doesn't exist, it is initialized to the given value
            - if variable exists, it is bound
        - only one section is allowed per passage
    ```
    <==state==>
    ~ index = 0
    ~ world_state = "grim"
    <==>
    ```
    - html block declarations `<==html==><==>`, `<==h><==>`
    	- multiple sections allowed per passage  

- [v0.5.x] Add additional ink support: 
	- [v0.5.1] ink INCLUDE implementation
		- INCLUDE name:passage_name
		- INCLUDE tag:passage_tag 
	- [v0.5.2] ink external function binding 

- [v0.6.x] Interactivity
	- [v0.6.0] Add basic conditional text insertion 
		- `<$boolean_expression: text>` -- reactive insertion (text can be seen if expression evaluates to true later)
		- `{boolean_expression: text}` -- static insertion (text will not be seen even if expression evaluates to true later)
	- [v0.6.1] Add support for variables being set to currently-displayed sequence value
		- `<^sequence_annotations?var%% text (% (text))>` 
		- `<&sequence_annotations?var%% text (% (text))>`  
		- this binds a dictionary to {var} with the following keys:
			- length (total # of elements in sequence)
			- index (current index position in sequence)
			- text (current text being displayed)
	- [v0.6.2] Add click-handler markup (function invocation)
		- `<[text]function_name(,function_name)>`
  	- [v0.6.3] Support block versions of above markup:
```
<<$boolean_expression:
- other boolean expression:
text
- else:
text
>>
```
```
<<(^|&)sequence_annotations(?var)%%
text
(%
text)
>>
```
```
<<[
text
]function_name(,function_name)
>>
```

- [v0.7.x] double-check basic twine story format stuff
	- Make sure that the JS in 'script' tagged passages (or the Story Javascript script) runs
	- Make sure that the CSS in 'style' tagged passages (or the Story Stylesheet passage) runs
	- Properly rocess the StoryData special passage
	- Properly Display a passage on game start as specified in StoryData

- [v0.8.x] image support
- [v0.8.0] Add custom markup to support base64 images (PNG & SVG): 
	- `<(image alt text)base64:source_string[;.css_class_name, .css_class_name]>`
- [v0.8.1] Embed SVG images from [game-icons.net](https://game-icons.net/): 
	- `<()icon:icon_name[;.css_class_name[,.css_class_name]]>`
	- alt text should be inserted automatically -- which will require some work
	- the website can be scraped for icon descriptions
		- these descriptions can be bundled with a static version of the icon pack
- [v0.8.2] Add support for minor icon manipulation: 
	- `<()icon:icon_name[;@[[background/foreground].[field]=[value][,[background/foreground].[field]=[value]]]>`
	- background:
		- gradient
		- coloring
		- shape
	- foreground:
		- gradient
		- coloring
		- transformations (mirror/flip/rotate)
- [v0.8.3] Add support for relative paths to image files: 
	- `<(image alt text)path:image_path>` 
- [v0.8.4] Add support for truncated images: 
	- `<&crop=[css manipulation idk](image alt text) ... >`
	- when initially shown, create a popup showing the full image	
	- when popup is closed, a version of the image cropped vertically is embedded into the passage text
		- ...it looks like this is going to require significant fiddling with CSS [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
		- there should be a magnifying icon to indicate it's still clickable
	- if the cropped image is clicked, the popup is shown again.

- [v0.9.x] final checks
	- [v0.9.0] flesh out grammar tests
	- [v0.9.1] decide on & add default CSS theme
		- text-centering
		- clickable elements?
			- links
			- sequences
			- ink-content block element
		- ink-block integration into main passage (dividers?)
	- [v0.9.2] allow additional theme settings
		- author should be able to provide alternative to defaults
		- player should always be able to use default
	- [v0.9.2] flesh out component tests
	- [v0.9.3] work on basic documentation
	- [v0.9.4] implement basic e2e tests
	- [v0.9.5] solicit feedback from Twine discord
	- [v0.9.6] implement feedback from Twine discord (1-2 weeks)
	- [v0.9.7] solicit more feedback (& refine stuff you hadn't thought of earlier)
	- [v0.9.8] implement more feedback from Twine discord
	- [v0.9.9] final documentation pass
