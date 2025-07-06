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

  it('Should properly populate its unescapedSource field when initialized', () => {
    const p = new Passage(null, null, "&lt;&gt;&amp;&amp;");
    expect(p.source).toBe("&lt;&gt;&amp;&amp;");
    expect(p.unescapedSource).toBe("<>&&");
  })
});
