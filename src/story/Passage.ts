/* The MIT License (MIT) Copyright (c) 2019 Chris Klimas, 2022 Dan Cox, 2025 Vincent H. */

import { parse } from '../grammar/passage';

/**
 * An object representing a passage.  
 */

class Passage {

  name: string;
  tags: string[];
  source: string;

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
  }

  renderTemplate(): HTMLTemplateElement {
    const parsedSource = parse(this.source);
    const template = document.createElement("template");

    template.innerHTML = parsedSource.render();

    return template;
  }
}

export { Passage };
