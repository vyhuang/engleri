# engleri

## TODO:
- Add basic newline support (see markup compilers?)

- Figure out basic state tracking
- Figure out saving / loading

- Add basic markup language `<@style(,style): >`:
    - bold/b
    - italic/i
    - strikethrough/s
    - underline/u
    - superscript/sp
    - subscript/sb
    - code/cd
    - smallcaps/sc (?)
- Add shortcut styling:
    - `_italic text_`
    - `__bold text__`
    - `___bold italic text___`
- Add css markup `<.class_name(,class_name): >`
- Add click-through sequences `<%seq_annotation(,seq_annotation): text % (text %)>`
- Add turn-through sequences `<^seq_annotation(,seq_annotation): text % (text %)>`
- Add specialized link annotation `<[[link_name]]destination>`
- Add basic block markup:
    ```
    << (@style(,style);)(.class_name(,class_name);)
    TEXT 
    >>
    ```

- Passage section headers:
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

- Add basic variable insertion `{var_name}`
- Add basic conditional text insertion `{boolean_expression: text}`
- Add variable support for sequences
    - `<%sequence_annotation(?var_name)?: text % (text %)>`
    - `<^sequence_annotation(?var_name)?: text % (text %)>`


