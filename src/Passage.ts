/**
 * An object representing a passage.  
 * * @class Passage
 */

class Passage {

  name: string;
  tags: string[];
  source: string;

  constructor (name: string | null, tags: string[] | null, source: string | null) {
    name ??= 'Default';
    tags ??= [];
    source ??= '';
    this.name = name;
    this.tags = tags;
    this.source = source;
  }

  /**
   * Replaces Twine link syntax (ex: '[[link->passage]]') in this passage's source with a <tw-link>,
   * and returns the result.
   */
  renderLinks() {
    const rules : [RegExp, string][] = [
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

export { Passage };
