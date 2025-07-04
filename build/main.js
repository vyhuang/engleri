(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.engleri = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var main$1 = {};

	/**
	 * An object representing a passage. The current passage will be `window.passage`.
	 * @class Passage
	 */

	var Passage_1;
	var hasRequiredPassage;

	function requirePassage () {
		if (hasRequiredPassage) return Passage_1;
		hasRequiredPassage = 1;
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

		Passage_1 = Passage;
		return Passage_1;
	}

	var Utils_1;
	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return Utils_1;
		hasRequiredUtils = 1;
		class Utils {
		    static generateElements(html) {
		        const template = document.createElement('template');
		        template.innerHTML = html.trim();
		        return template.content.children;
		    }

		    static addEventListener(eventName, eventHandler, selector) {
		        const wrappedHandler = (e) => {
		            if (!e.target) return;
		            const el = e.target.closest(selector);
		            if (el) {
		                eventHandler.call(el, e);
		            }
		        };
		        document.addEventListener(eventName, wrappedHandler);
		        return wrappedHandler;
		    }
		}

		Utils_1 = Utils;
		return Utils_1;
	}

	/**
	 * @external Element
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}
	 */

	var Story_1;
	var hasRequiredStory;

	function requireStory () {
		if (hasRequiredStory) return Story_1;
		hasRequiredStory = 1;
		const Passage = requirePassage();
		const Utils = requireUtils();

		/**
		 * An object representing the entire story. After the document has completed
		 * loading, an instance of this class will be available at `window.Story`.
		 * @class Story
		 */
		class Story {
		  constructor () {
		    /**
		     * @property {string} name - The name of the story.
		     * @type {string}
		     * @readonly
		     */
		    this.name = document.querySelector('tw-storydata').getAttribute('name');

		    /**
		     * An array of all passages.
		     * @property {Array} passages - Passages array.
		     * @type {Array}
		     */
		    this.passages = [];

		    // For each child element of the `<tw-storydata>` element,
		    //  create a new Passage object based on its attributes.
		    document.querySelector('tw-storydata').querySelectorAll('tw-passagedata').forEach((element) => {
		      const elementReference = element;
		      // Access any potential tags.
		      let tags = elementReference.getAttribute('tags');

		      // Does the 'tags' attribute exist?
		      if (tags !== '' && tags !== undefined) {
		        // Attempt to split by space.
		        tags = tags.split(' ');
		      } else {
		        // It did not exist, so we create it as an empty array.
		        tags = [];
		      }

		      // Push the new passage.
		      this.passages.push(new Passage(
		        elementReference.getAttribute('name'),
		        tags,
		        elementReference.innerHTML,
		      ));
		    });

		    /**
		     * Passage element.
		     * @property {Element} passageElement Passage element.
		     * @type {Element}
		     */
		    this.passageElement = document.querySelector('tw-passage');

		    /**
		     * The current passage.
		     * @property {Passage|null} currentPassage Currently showing passage, if any.
		     * @type {Passage|null}
		     */
		    this.currentPassage = null;

		  }
		  // end constructor.

		  /**
		   * Begins playing this story based on data from tw-storydata.
		   * 1. Apply all user styles
		   * 2. Run all user scripts
		   * 3. Find starting passage
		   // Excised //* 4. Add to starting passage to History.history
		   * 5. Show starting passage
		   // Excised // * 6. Trigger 'start' event
		   * @function start
		   */
		  start () {

		    // For each Twine style, add them to the body as extra style elements.
		    /*
		    document.querySelectorAll('*[type="text/twine-css"]').forEach((element) => {
		      const twineStyleElement = element;
		      // Append a new `<style>` with text from old.
		      document.body.append(
		        Utils.generateElements(`<style>${twineStyleElement.textContent}</style>`));
		    });
		    */

		    /**
		     * Note: Browsers prevent error catching from scripts
		     *  added after the initial loading.
		     *
		     * window.onerror will have error, but it cannot
		     *  be caught.
		     */
		    /*
		    document.querySelectorAll('*[type="text/twine-javascript"]').forEach((element) => {
		      // Convert Element into jQuery Element.
		      const twineScriptElement = element;
		      // Create a new `<script>`.
		      const newScriptElement = Utils.generateElements("<script>");
		      // Set the text of new from old.
		      newScriptElement.textContent = twineScriptElement.textContent;
		      // Append the new `<script>` with text to document body.
		      document.body.append(newScriptElement);
		    });
		    */

		    // Get the startnode value (which is a number).
		    const startingPassageID = parseInt(document.querySelector('tw-storydata').getAttribute('startnode'));
		    // Use the PID to find the name of the starting passage based on elements.
		    const startPassageName = document.querySelector(`[pid="${startingPassageID}"]`).getAttribute('name');
		    // Search for the starting passage.
		    const passage = this.getPassageByName(startPassageName);

		    // Does the starting passage exist?
		    if (passage === null) {
		      // It does not exist.
		      // Throw an error.
		      throw new Error('Starting passage does not exist!');
		    }

		    // Set the global passage to the one about to be shown.
		    this.currentPassage = passage;

		    // Overwrite current tags
		    this.passageElement.setAttribute('tags', passage.tags);

		    // Get passage source.
		    const passageSource = this.include(passage.name);

		    // Overwrite the parsed with the rendered.
		    this.passageElement.innerHTML = passageSource;

		    // Listen for any reader clicking on `<tw-link>`.
		    Utils.addEventListener(
		        'click', 
		        (event) => { 
		          // Retrieve data-passage value.  
		          const passageName = event.target.getAttribute('data-passage');
		          // Show the passage by name.
		          this.show(passageName); 
		        },
		        'tw-link[data-passage]'
		      );
		  }

		  /**
		   * Returns an array of none, one, or many passages matching a specific tag.
		   * @function getPassagesByTag
		   * @param {string} tag - Tag to search for.
		   * @returns {Array} Array containing none, one, or many passage objects.
		   */
		  getPassagesByTag (tag) {
		    // Search internal passages
		    return this.passages.filter((p) => {
		      return p.tags.includes(tag);
		    });
		  }

		  /**
		   * Returns a Passage object by name from internal collection. If none exists, returns null.
		   * The Twine editor prevents multiple passages from having the same name, so
		   * this always returns the first search result.
		   * @function getPassageByName
		   * @param {string} name - name of the passage
		   * @returns {Passage|null} Passage object or null
		   */
		  getPassageByName (name) {
		    // Create default value
		    let passage = null;

		    // Search for any passages with the name
		    const result = this.passages.filter((p) => p.name === name);

		    // Were any found?
		    if (result.length !== 0) {
		      // Grab the first result.
		      passage = result[0];
		    }

		    // Return either null or first result found.
		    return passage;
		  }

		  /**
		   * Replaces current passage shown to reader with rendered source of named passage.
		   * If the named passage does not exist, an error is thrown.
		   * @function show
		   * @param {string} name name of the passage.
		   */
		  show (name) {
		    // Look for passage by name.
		    const passage = this.getPassageByName(name);

		    // passage will be null if it was not found.
		    if (passage === null) {
		      // Passage was not found.
		      // Throw error.
		      throw new Error(`There is no passage with the name ${name}`);
		    }

		    // Set currentPassage to the one about to be shown.
		    this.currentPassage = passage;

		    // Overwrite current tags.
		    this.passageElement.getAttribute('tags', passage.tags);

		    // Get passage source by name.
		    const passageSource = this.include(passage.name);

		    // Overwrite any existing HTML.
		    this.passageElement.innerHTML = passageSource;

		    // Listen for any reader clicking on `<tw-link>`.
		    Utils.addEventListener(      
		      'click', 
		      (event) => {
		        // Retrieve data-passage value.
		        const passageName = event.target.getAttribute('data-passage');
		        // Show the passage by name.
		        this.show(passageName); 
		      },
		      'tw-link[data-passage]', 
		    );
		  }

		  /**
		   * Returns the rendered source of a passage by name.
		   * @function include
		   * @param {string} name - name of the passage.
		   * @returns {string} Rendered passage source.
		   */
		  include (name) {
		    // Search for passage by name.
		    const passage = this.getPassageByName(name);

		    // Does this passage exist?
		    if (passage === null) {
		      // It does not exist.
		      // Throw error.
		      throw new Error('There is no passage with name ' + name);
		    }

		    // Get passage source.
		    let passageSource = passage.renderLinks();

		    // Return the passage source.
		    return passageSource;
		  }

		  /**
		   * Render a passage to any/all element(s) matching query selector
		   * @function renderPassageToSelector
		   * @param {object} passageName - The passage to render
		   * @param {string} selector - jQuery selector
		   */
		  renderPassageToSelector (passageName, selector) {
		    // Get passage source
		    const passageSource = this.include(passageName);

		    // Replace the HTML of the selector (if valid).
		    document.query(selector).innerHTML = passageSource;
		  }

		  /**
		   * Add a new passage to the story.
		   * @function addPassage
		   * @param {string} name name
		   * @param {Array} tags tags
		   * @param {string} source source
		   */
		  addPassage (name = '', tags = [], source = '') {
		    // Look for name.
		    const nameSearch = this.getPassageByName(name);

		    // Confirm name does not already exist.
		    if (nameSearch !== null) {
		      throw new Error('Cannot add two passages with the same name!');
		    }

		    // Confirm tags is an array.
		    if (!Array.isArray(tags)) {
		      // Ignore and set to empty array.
		      tags = [];
		    }

		    // Confirm if source is string.
		    if (Object.prototype.toString.call(source) !== '[object String]') {
		      // Ignore and set to empty string.
		      source = '';
		    }

		    // Add to the existing passages.
		    this.passages.push(new Passage(
		      name,
		      tags,
		      source,
		    ));
		  }

		  /**
		   * Remove a passage from the story internal collection.
		   * Removing a passage and then attempting to visit the passage will
		   * throw an error.
		   *
		   * Note: Does not affect HTML elements.
		   * @function removePassage
		   * @param {string} name name
		   */
		  removePassage (name = '') {
		    this.passages = this.passages.filter(passage => {
		      return passage.name !== name;
		    });
		  }

		  /**
		   * Go to an existing passage in the story. Unlike `Story.show()`, this will add to the history.
		   *
		   * Throws error if passage does not exist.
		   * @function goto
		   * @param {string} name name of passage
		   */
		  goto (name = '') {
		    // Look for passage.
		    const passage = this.getPassageByName(name);

		    // Does passage exist?
		    if (passage === null) {
		      // Throw error.
		      throw new Error(`There is no passage with the name ${name}`);
		    }

		    // Show the passage by name.
		    this.show(name);
		  }
		}

		Story_1 = Story;
		return Story_1;
	}

	var hasRequiredMain;

	function requireMain () {
		if (hasRequiredMain) return main$1;
		hasRequiredMain = 1;
		// Require Story.
		const Story = requireStory();
		// Create new Story instance.
		window.Story = new Story();
		// Create global store shortcut.
		window.s = window.Story.store;
		// Start story.
		window.Story.start();
		return main$1;
	}

	var mainExports = requireMain();
	var main = /*@__PURE__*/getDefaultExportFromCjs(mainExports);

	return main;

}));
