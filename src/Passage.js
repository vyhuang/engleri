/**
 * An object representing a passage.  
 * * @class Passage
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

  /**
   * Replaces Twine link syntax (ex: '[[link->passage]]') in this passage's source with a <tw-link>,
   * and returns the result.
   */
  renderLinks() {
    const rules = [
      // [[link_name|target_passage]]
      // [[link_name->target_passage]]
      [/\[\[(.+)(\||-\&gt;)(.+)\]\]/g, '<tw-link data-passage="$3">$1</tw-link>'],
      // [[link_name<-target_passage]]
      [/\[\[(.+)\&lt;-(.+)?\]\]/g, '<tw-link data-passage="$1">$2</tw-link>']
    ];

    let text = this.source;

    rules.forEach(([rule, template]) => {
      text = text.replaceAll(rule, template);
    });

    return text;
  }
}

module.exports = Passage;