# engleri

## TODO:
- ~~Add specialized link annotation `<[[link_name|destination]]>`~~
- ~~Add basic newline support (see markup compilers?) [v0.1.1]~~
- ~~Cleanup current parsing code so it isn't a huge mess [v0.1.2]~~
- ~~Write basic tests for grammar & story/passage functionality~~

- Figure out basic state tracking [v0.2.0]
- Figure out saving / loading [v0.3.0]

- Add basic markup language `<@style(,style): >`: [v0.3.1]
    - bold/b
    - italic/i
    - strikethrough/s
    - underline/u
    - superscript/sp
    - subscript/sb
    - code/cd
    - smallcaps/sc (?)
- Add shortcut styling: [v0.3.2]
    - `_italic text_`
    - `__bold text__`
    - `___bold italic text___`
- Add css markup `<.class_name(,class_name): >` [v0.3.3]
- Add click-through sequences `<%seq_annotation(,seq_annotation): text % (text %)>` [v0.3.4]
- Add turn-through sequences `<^seq_annotation(,seq_annotation): text % (text %)>` [v0.3.5]
- Add basic block markup: [v0.3.6]
    ```
    << (@style(,style);)(.class_name(,class_name);)
    TEXT 
    >>
    ```

- Passage section headers: [v0.4.0]
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
    - ink source `<==text==><==>`, `<==t><==>`
        - only one ink source is allowed per passage

- Add basic ink support: 
    - brute-force writing to a div [v0.5.0]
    - ink includes for other passages [v0.5.1]
    - ink external function [v0.5.2]
    - ink integration with state tracking [v0.5.3]
    - ink saves/loads [v0.5.4]

- Add basic variable insertion `{var_name}` [v0.6.0]
- Add basic conditional text insertion `{boolean_expression: text}` [v0.6.1]
- Add variable support for sequences [v0.6.2]
    - `<%sequence_annotation(?var_name)?: text % (text %)>`
    - `<^sequence_annotation(?var_name)?: text % (text %)>`


