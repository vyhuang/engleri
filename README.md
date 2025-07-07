# engleri

## TODO:
- ~~Add specialized link annotation `<[[link_name|destination]]>`~~
- ~~Add basic newline support (see markup compilers?) [v0.1.1]~~
- ~~Cleanup current parsing code so it isn't a huge mess [v0.1.2]~~
- ~~Write basic tests for grammar & story/passage functionality~~

- [v0.2.x] Integrate inkjs & ink runtime into passage (basic functionality)
	- [v0.2.0] Implement ink text 'section' syntax 
		-  ink source `<==text==><==>`, `<==t><==>` (allowed once a passage)
		- [v0.2.1] print lines of text 
		- [v0.2.2] make choices clickable 
	- [v0.2.3] Figure out state tracking 
		- game should constantly be tracking game state
			- this includes all of ink's tracking variables too!
			- this also means that passages should continue to display already-shown text (unless tagged otherwise)
				- (this might be possible through abusing the saveToJson/loadFromJson functionality the runtime has)
		- ink variables & state should be fully accessible & modifiable by the twine engine at all times
			- this theoretically allows for full out-of-ink support
	- [v0.2.4] Add basic variable insertion 
		- `<$var_name>` -- reactive insertion (the value can change after it's been shown) 
		- `{var_name}` -- static insertion (the value will not change after it's been shown)
	- [v0.2.4] Figure out saving / loading 

- [v0.3.x]
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
	- [v0.3.5] Add turn-through sequences `<%seq_annotation(,seq_annotation)%% text (% (text))>` 
	- [v0.3.6] Add basic block markup: 
			```
			<< (@style(,style);)(.class_name(,class_name);)
			TEXT 
			>>
			```

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

- [v0.5.x] Add additional ink support: 
	- [v0.5.1] ink INCLUDE implementation
		- INCLUDE name:passage_name
		- INCLUDE tag:passage_tag 
	- [v0.5.2] ink external function binding 

- [v0.6.x] Interactivity
	- [v0.6.0] Add basic conditional text insertion 
		- `<:boolean_expression: text>` -- reactive insertion (text can be seen if expression evaluates to true later)
		- `{boolean_expression: text}` -- static insertion (text will not be seen even if expression evaluates to true later)
	- [v0.6.1] Add support for variables being set to currently-displayed sequence value
		- `<^sequence_annotations?var%% text (% (text))>` 
		- `<%sequence_annotations?var%% text (% (text))>`  
		- this binds a dictionary to {var} with the following keys:
			- length (total # of elements in sequence)
			- index (current index position in sequence)
			- text (current text being displayed)
	- [v0.6.2] Add click-handler markup
		- `<[text]function_name(,function_name)>`


