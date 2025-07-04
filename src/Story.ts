/**
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}
 */
import { Passage } from './Passage';
import { Utils } from './Utils';

/**
 * An object representing the entire story.  
 * @class Story
 */
class Story {
  name: string | null;
  passages: Passage[];

  storyData: Element;
  workingPassage: Element;

  currentPassage: Passage | null;

  constructor () {

    let storydataElement = document.querySelector('tw-storydata');

    if (storydataElement === null) {
      throw new Error("Could not find '<tw-storydata>' element!");
    }

    this.storyData = storydataElement;

    this.name = this.storyData.getAttribute('name');

    this.passages = [];

    // For each child element of the `<tw-storydata>` element,
    //  create a new Passage object based on its attributes.
    this.storyData.querySelectorAll('tw-passagedata').forEach((element) => {
      // Access any potential tags.
      let tagsValue = element.getAttribute('tags');

      // Does the 'tags' attribute exist?
      let tags: string[];
      if (tagsValue !== '' && tagsValue) {
        // Attempt to split by space.
        tags = tagsValue.split(' ');
      } else {
        // It did not exist, so we create it as an empty array.
        tags = [];
      }

      // Push the new passage.
      this.passages.push(new Passage(
        element.getAttribute('name'),
        tags,
        element.innerHTML,
      ));
    });

    let workingPassage;
    if (!(workingPassage = document.querySelector('tw-passage'))) {
      throw new Error("Unable to locate <tw-passage>!")
    }
    this.workingPassage = workingPassage;

    this.currentPassage = null;

  }
  // end constructor.

  /**
   * Begins playing this story based on data from tw-storydata.
   * 1. Find starting passage
   * 2. Show starting passage
   */
  start () {

    // Get the startnode value (which is a number).
    let passageIDStr = this.storyData.getAttribute('startnode');

    if (!passageIDStr) {
      throw new Error('Unable to fetch startnode value!');
    }

    const startingPassageID = parseInt(passageIDStr);
    // Use the PID to find the name of the starting passage based on elements.
    let startingPassage: Element | null;
    let startPassageName: string | null;
    if (!(startingPassage = document.querySelector(`[pid="${startingPassageID}"]`)) 
        || !(startPassageName = startingPassage.getAttribute('name'))) {
      throw new Error('Unable to fetch starting passage name!');
    } 

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
    this.workingPassage.setAttribute('tags', passage.tags.join(" "));

    // Get passage source.
    const passageSource = this.include(passage.name);

    // Overwrite the parsed with the rendered.
    this.workingPassage.innerHTML = passageSource;

    // Listen for any reader clicking on `<tw-link>`.
    Utils.addEventListener(
        'click', 
        (event) => { 
          if (event.target instanceof Element) {
            // Retrieve data-passage value.  
            const passageName = event.target.getAttribute('data-passage');
            // Show the passage by name.
            this.show(passageName); 
          }
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
  getPassagesByTag (tag: string): Array<any> {
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
  getPassageByName (name: string): Passage | null {
    // Create default value
    let passage : Passage | null = null;

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
   */
  show (name: string) {
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
    this.workingPassage.setAttribute('tags', passage.tags.join(" "));

    // Get passage source by name.
    const passageSource = this.include(passage.name);

    // Overwrite any existing HTML.
    this.workingPassage.innerHTML = passageSource;

    // Listen for any reader clicking on `<tw-link>`.
    Utils.addEventListener(      
      'click', 
      (event) => {
        if (event.target instanceof Element) {
          // Retrieve data-passage value.
          const passageName = event.target.getAttribute('data-passage');
          // Show the passage by name.
          this.show(passageName); 
        }
      },
      'tw-link[data-passage]', 
    );
  }

  /**
   * Returns the rendered source of a passage by name.
   */
  include (name: string): string {
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
   */
  renderPassageToSelector (passageName: string, selector: string) {
    // Get passage source
    const passageSource = this.include(passageName);

    // Replace the HTML of the selector (if valid).
    let element = document.querySelector(selector);
    if (element) {
      element.innerHTML = passageSource;
    }
  }

  /**
   * Add a new passage to the story.
   */
  addPassage (name: string = '', tags: string[] = [], source: string = '') {
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
   */
  removePassage (name: string = '') {
    this.passages = this.passages.filter(passage => {
      return passage.name !== name;
    });
  }

  /**
   * Go to an existing passage in the story.
   * Throws error if passage does not exist.
   */
  goto (name: string = '') {
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

export { Story };
