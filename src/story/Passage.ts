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
  parsedSource: ParsedPassage;

  inkSource: string;

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

    this.parsePassage();
  }

  parsePassage() {
    this.unescapedSource = Passage.unescapeHtml(this.source);
    this.parsedSource = parse(this.unescapedSource);
  }

  renderTemplate(): HTMLTemplateElement {
    const template = document.createElement("template");

    let renderedHtml = "";
    this.parsedSource.contents.forEach((chunk) => {
      renderedHtml += chunk.render();

      if (chunk.typeName === "InkText") {
        this.inkSource = chunk.values.join("");
      }
    });

    template.innerHTML = renderedHtml;

    return template;
  }

  static unescapeHtml(source: string) {
    let doc = new DOMParser().parseFromString(source, "text/html");
    return doc.documentElement.textContent;
  }
}

interface ParsedPassage {
  includes: string[];
  contents: ParsedObject[];
}

interface ParsedObject {
	typeName: string;
	values: (ParsedObject | string)[];
	reduce: (arg: (ParsedObject | string)[]) => string;
  render: () => string;
}

export { Passage };
