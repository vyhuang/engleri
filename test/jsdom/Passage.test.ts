/* The MIT License (MIT) Copyright (c) 2019 Chris Klimas, 2022 Dan Cox, 2025 Vincent H.*/

import '@jest/globals';
import { Passage } from '../../src/story/Passage';

describe('constructor()', () => {
  it('Should contain default name when initialized with no arguments', () => {
    const p = new Passage();
    expect(p.name).toBe('Default');
  });

  it('Should contain default tags when initialized with no arguments', () => {
    const p = new Passage();
    expect(p.tags.length).toBe(0);
  });

  it('Should contain default source when initialized with no arguments', () => {
    const p = new Passage();
    expect(p.source).toBe('');
  });

  it('Should populate its unescapedSource field when initialized', () => {
    const p = new Passage(null, null, "\\&lt;\\&gt;&amp;&amp;");
    expect(p.source).toBe("\\&lt;\\&gt;&amp;&amp;");
    expect(p.unescapedSource).toBe("\\<\\>&&");
    expect(p.parsedSource).not.toBeNull();
  });
});

describe('renderStaticElements()', () => {
  let passage: Passage;
  beforeEach(() => {
    let passageSource=`
    first line
    second line (with link) [[link\\_name -> passage\\_name]]
    <==text==>
    Ink source text goes here:
    * choice 1
    * choice 2
    * choice 3 [] 
    - gather 
    <> and glue.
    <==>`;

    passage = new Passage(null, null, passageSource);
    passage.renderStaticElements();

  });

  it('Should correctly generate rendered chunks', () => {
    expect(passage.parsedSource.contents.length).toEqual(4);
    expect(passage.parsedSource.contents[0].typeName).toBe("mixedLine");
    expect(passage.renderedChunks[0]).toBe("<p>first line</p>\n")
    expect(passage.parsedSource.contents[1].typeName).toBe("mixedLine");
    expect(passage.renderedChunks[1]).toBe(
      "<p>second line (with link) <tw-link data-passage=\"passage_name\">link_name</tw-link></p>\n")
    expect(passage.parsedSource.contents[2].typeName).toBe("mixedLine");
    expect(passage.renderedChunks[2]).toBe("<p></p>\n")
    expect(passage.parsedSource.contents[3].typeName).toBe("InkText");
    expect(passage.renderedChunks[3]).toBe("<div id='ink_block'></div>\n")
  });

  it('Should correctly populate its inkSource field', () => {
    console.log(passage);
    expect(passage.inkSource).not.toBeNull();
    expect(passage.inkSource).toContain("Ink source text goes here:");
    expect(passage.inkSource).toContain("* choice 1");
    expect(passage.inkSource).toContain("* choice 2");
    expect(passage.inkSource).toContain("* choice 3 []");
    expect(passage.inkSource).toContain("- gather");
    expect(passage.inkSource).toContain("<> and glue.");
  });
});
