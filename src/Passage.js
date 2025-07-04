/**
 * An object representing a passage. The current passage will be `window.passage`.
 * @class Passage
 */

class Passage {
  constructor (name = 'Default', tags = [], source = '') {
    /**
     * @property {string} name - The name of passage
     * @type {string}
     */

    this.name = name;

    /**
     * @property {Array} tags - The tags of the passage.
     * @type {Array}
     */

    this.tags = tags;

    /**
     * @property {string} source - The passage source code.
     * @type {string}
     */

    this.source = source;
  }

  // TODO: rip this out later
  static parse (text) {
    const rules = [
      // [[rename|destination][onclick]]
      // [/\[\[(.*?)\|(.*?)\](?:\[(.*?)\])?\]/g, (m, p1, p2, p3 = '') => `<tw-link role="link" onclick="${p3.replaceAll('s.', 'window.Story.state.')}" data-passage="${p2}">${p1}</tw-link>`],
      // [[rename|destination]]
      [/\[\[(.*?)\|(.*?)\]\]/g, '<tw-link role="link" data-passage="$2">$1</tw-link>'],
      // [[rename->dest][onclick]]
      // [/\[\[(.*?)->(.*?)\](?:\[(.*?)\])?\]/g, (m, p1, p2, p3 = '') => `<tw-link role="link" onclick="${p3.replaceAll('s.', 'window.Story.state.')}" data-passage="${p2}">${p1}</tw-link>`],
      // [[rename->dest]]
      // [/\[\[(.*?)->(.*?)\]\]/g, '<tw-link role="link" data-passage="$2">$1</tw-link>'],
      // [[dest<-rename][onclick]]
      // [/\[\[(.*?)<-(.*?)\](?:\[(.*?)\])?\]/g, (m, p1, p2, p3 = '') => `<tw-link role="link" onclick="${p3.replaceAll('s.', 'window.Story.state.')}" data-passage="${p1}">${p2}</tw-link>`],
      // [[dest<-rename]]
      // [/\[\[(.*?)<-(.*?)\]\]/g, '<tw-link role="link" data-passage="$1">$2</tw-link>'],
      // [[destination][onclick]]
      // [/\[\[(.*?)\](?:\[(.*?)\])?\]/g, (m, p1, p2 = '') => `<tw-link role="link" onclick="${p2.replaceAll('s.', 'window.Story.state.')}" data-passage="${p1}">${p1}</tw-link>`]
      // [[destination]]
      // [/\[\[(.*?)\]\]/g, '<tw-link role="link" data-passage="$1">$1</tw-link>']
    ];

    rules.forEach(([rule, template]) => {
      text = text.replaceAll(rule, template);
    });

    return text;
  }
}

module.exports = Passage;