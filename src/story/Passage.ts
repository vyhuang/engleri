/* The MIT License (MIT) Copyright (c) 2019 Chris Klimas, 2022 Dan Cox, 2025 Vincent H. */

import { parse } from '../grammar/passage';

/**
 * An object representing a passage.  
 */

class Passage {

  name: string;
  tags: string[];
  source: string;
  unescapedSource: string;

  constructor (
    name: string | null = 'Default', 
    tags: string[] | null = [], 
    source: string | null = '') {

    name ??= 'Default';
    tags ??= [];
    source ??= '';
    this.name = name;
    this.tags = tags;
    this.source = source;
    this.unescapedSource = Passage.unescapeHtml(source);
  }

  renderTemplate(): HTMLTemplateElement {
    const parsedSource = parse(this.unescapedSource);
    const template = document.createElement("template");

    template.innerHTML = parsedSource.render();

    return template;
  }

  static unescapeHtml(source: string) {
    let doc = new DOMParser().parseFromString(source, "text/html");
    return doc.documentElement.textContent;
  }
}

export { Passage };
