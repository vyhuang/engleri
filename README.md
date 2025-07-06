# engleri

## TODO:
- ~~Add specialized link annotation `<[[link_name|destination]]>`~~
- ~~Add basic newline support (see markup compilers?) [v0.1.1]~~
- ~~Cleanup current parsing code so it isn't a huge mess [v0.1.2]~~
- ~~Write basic tests for grammar & story/passage functionality~~

- [v0.2.x] Integrate inkjs & ink runtime into passage (basic functionality)
		- [v0.2.0] Implement ink text 'section' syntax 
			- ink source `<==text==><==>`, `<==t><==>` (allowed once a passage)
		- [v0.2.1] print lines of text 
		- [v0.2.2] make choices clickable 
- [v0.2.0] Figure out state tracking 

- [v0.3.0] Figure out saving / loading 

- [v0.3.1] Add basic markup language `<@style(,style): >`
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
- [v0.3.4] Add click-through sequences `<%seq_annotation(,seq_annotation): text % (text %)>` 
- [v0.3.5] Add turn-through sequences `<^seq_annotation(,seq_annotation): text % (text %)>` 
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
        - only one is allowed per passage
    ```
    <==require==>
    @passage_name
    #passage_tag
    <==>
    ```
    - state variable declarations `<==var==><==>`, `<==v><==>`
        - `~ var_name = <value>`
            - if variable doesn't exist, it is initialized to the given value
            - if variable exists, it is bound
        - only one is allowed per passage
    ```
    <==state==>
    ~ index = 0
    ~ world_state = "grim"
    <==>
    ```

- [v0.5.x] Add additional ink support: 
    - brute-force writing to a div 
    - [v0.5.1] ink includes for other passages 
    - [v0.5.2] ink external function 

- [v0.6.0] Add basic variable insertion `{var_name}` 
- [v0.6.1] Add basic conditional text insertion `{boolean_expression: text}` 
- [v0.6.2] Add variable support for sequences 
    - `<%sequence_annotation(?var_name)?: text % (text %)>`
    - `<^sequence_annotation(?var_name)?: text % (text %)>`


