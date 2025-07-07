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

  renderedChunks: string[];
  template: HTMLTemplateElement;

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

    this.template = document.createElement("template");
    this.parsePassage();
  }

  parsePassage() {
    this.unescapedSource = Passage.unescapeHtml(this.source);
    this.parsedSource = parse(this.unescapedSource);
  }

  renderStaticElements(): HTMLTemplateElement {
    let result = Passage.renderChunks(this.parsedSource.contents);

    this.renderedChunks = result.chunks;
    this.inkSource = result.inkSource;

    this.template.innerHTML = result.chunks.join("");

    return this.template;
  }

  static renderChunks(sourceChunks: ParsedObject[]): { chunks: string[], inkSource: string } {
    let inkSource = "";
    let chunks = sourceChunks.map((chunk) => {
        if (chunk.typeName === "InkText") {
          inkSource = chunk.values.join("");
        }

        return chunk.render(); 
      });

    return { chunks, inkSource };
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
