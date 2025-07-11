/* The MIT License (MIT) Copyright (c) 2019 Chris Klimas, 2022 Dan Cox, 2025 Vincent H. */

/**
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}
 */
import { Passage } from './Passage';
import { Utils } from './Utils';
import { Compiler, Story as inkStory } from '../../node_modules/inkjs/ink';

/**
 * An object representing the entire story.  
 * @class Story
 */
class Story {
  name: string | null;
  passages: Passage[];
  defaultPassages: Map<String,Passage[]>;

  storyData: Element;
  workingPassage: Element;

  currentPassage: Passage | null;
  currentInkStory: inkStory | null;
  inkBlock: Element;

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

    this.defaultPassages = new Map();

    // Create passage from `<tw-storydefaults>` elements, and compile them to 
    // internal passages as appropriate
    document.querySelectorAll('tw-storydefaults').forEach((element) => {
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

      tags.forEach((tag) => {
        let passage = new Passage(
          element.getAttribute('name'),
          tags,
          element.innerHTML);
        
        //console.log(passage);

        if (this.defaultPassages.has(tag)) {
          this.defaultPassages.get(tag).push(passage);
        } else {
          let passageList = [passage]
          this.defaultPassages.set(tag, passageList);
        }
      })
    })

    let workingPassage;
    if (!(workingPassage = document.querySelector('tw-passage'))) {
      throw new Error("Unable to locate <tw-passage>!")
    }
    this.workingPassage = workingPassage;

    this.currentPassage = null;
    this.currentInkStory = null;
    this.inkBlock = null;
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
    const passageTemplate = this.include(passage.name);

    // Overwrite the passage with the rendered.
    this.workingPassage.innerHTML = "";
    this.workingPassage.appendChild(passageTemplate.content.cloneNode(true));

    // Set currentInkStory to the one belonging to this passage 
    // (note: this has to be done after include())
    if (passage.inkSource.length > 0) {
      this.currentInkStory = new Compiler(passage.inkSource).Compile();

      this.renderDefaultPassageToSelector("ink_block", "basic_ink_block", "div#ink_block");
      this.inkBlock = this.workingPassage.querySelector("#ink_block");

      console.log(this.currentInkStory);
      this.updateInk();
    } else {
      this.currentInkStory = null;
    }

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
    // Listen for any reader clicking on `<div id='ink_content'>` or `<div id='tap_reminder'>`
    Utils.addEventListener(      
      'click', 
      () => {
        console.log("ink content clicked");
        if (this.currentInkStory) {
          this.updateInk();
        }
      },
      'div#ink_content,div#tap_reminder', 
    );
    // Listen for any reader clicking on `<a class='ink_choice'>`
    Utils.addEventListener(
      'click',
      (event) => {
        console.log("ink choice clicked");
        if (event.target instanceof HTMLAnchorElement) {
          // Retrieve data-passage value.
          const choiceIndex = event.target.getAttribute('choiceIndex');
          // Update the ink block with the chosen choice.
          this.updateInk(parseInt(choiceIndex));
        }
      },
      'a.ink_choice'
    )

    if (this.currentInkStory) {
      this.updateInk();
    }
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
   */
  getPassageByName (name: string, tag?: string): Passage | null {
    // Create default value
    let passage : Passage | null = null;

    // Search for any passages with the name
    let result: Passage[] = [];
    if (tag && this.defaultPassages.has(tag)) {
      result = this.defaultPassages.get(tag).filter((p) => p.name === name);
    } else {
      result = this.passages.filter((p) => p.name === name);
    }

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
    const passageTemplate = this.include(passage.name);

    // Overwrite any existing HTML.
    this.workingPassage.innerHTML = "";
    this.workingPassage.appendChild(passageTemplate.content.cloneNode(true));

    // Set currentInkStory to the one belonging to this passage 
    // (note: this has to be done after include())
    if (passage.inkSource.length > 0) {
      this.currentInkStory = new Compiler(passage.inkSource).Compile();

      this.renderDefaultPassageToSelector("ink_block", "basic_ink_block", "div#ink_block");
      this.inkBlock = this.workingPassage.querySelector("#ink_block");

      console.log(this.currentInkStory);
      this.updateInk();
    } else {
      this.currentInkStory = null;
    }

    /*
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

    // Listen for any reader clicking on `<div id='ink_block'>`
    Utils.addEventListener(      
      'click', 
      () => {
        if (this.currentInkStory) {
          this.update();
        }
      },
      'div#ink_block', 
    );

    // Listen for any reader clicking on `<a class='ink_choice'>`
    Utils.addEventListener(
      'click',
      (event) => {
        if (event.target instanceof HTMLAnchorElement) {
          // Retrieve data-passage value.
          const choiceIndex = event.target.getAttribute('choiceIndex');
          // Update the ink block with the chosen choice.
          this.updateInk(parseInt(choiceIndex));
        }
      },
      'a.ink_choice'
    )
      */
  }

  /**
   * Updates the working passage's contents.
   */
  update() {
  }

  /**
   * Update the ink block with new text (if it exists)
   */
  updateInk(choiceIndex: number | undefined = -1) {
    if (this.currentInkStory === null || !this.inkBlock === null) {
      return;
    }

    let inkContent : Element | null = this.inkBlock.querySelector("div#ink_content");
    let inkChoices : Element | null = this.inkBlock.querySelector("div#ink_choices");
    let tapReminder : Element | null = this.inkBlock.querySelector("div#tap_reminder");

    let contentTemplate = this.inkBlock.querySelector('#content_template');
    let choiceTemplate = this.inkBlock.querySelector('#choice_template');

    let changeMade = false;
    if (choiceIndex >= 0) {
      if (inkChoices.getAttribute("hidden")) {
        throw new Error("#ink_choices element should not be hidden!")
      }
      this.currentInkStory.ChooseChoiceIndex(choiceIndex);
      inkChoices.setAttribute("hidden", "hidden");
      inkChoices.querySelectorAll(".ink_choice").forEach(
        (choiceElement) => {
          if (choiceElement.id === "choice_template") {
            return;
          }
          choiceElement.parentElement.removeChild(choiceElement);
        });

      changeMade = true;
    } 
    
    if (this.currentInkStory.canContinue) {
      // Clone the content template
      let element = document.createElement(contentTemplate.tagName);
      [...contentTemplate.attributes].forEach(({name, value}) => {
        element.setAttribute(name, value);
      })
      element.id = "";
      element.removeAttribute("hidden");

      let nextString = this.currentInkStory.Continue()
      element.innerHTML = contentTemplate.innerHTML.replace("{content}", nextString);

      inkContent.appendChild(element);

      changeMade = true;
    } 
    if (this.currentInkStory.canContinue) {
      tapReminder.removeAttribute("hidden");
    } else {
      tapReminder.setAttribute("hidden", "hidden");
    }


    if (inkChoices.getAttribute("hidden") && this.currentInkStory.currentChoices.length > 0 ) {

      this.currentInkStory.currentChoices.forEach((choice, index) => {
        // Clone the choice template
        let element = document.createElement(choiceTemplate.tagName);
        [...choiceTemplate.attributes].forEach(({name, value}) => {
          element.setAttribute(name, value.replace("{choiceIndex}", `${index}`));
        })
        element.id = "";
        element.removeAttribute("hidden");

        let elementInnerHtml = choiceTemplate.innerHTML.
          replace("{choiceIndex}", `${index}`).
          replace("{choiceText}", choice.text);
        element.innerHTML = elementInnerHtml;
        element.appendChild(document.createElement("br"));

        inkChoices.appendChild(element);
      });

      inkChoices.removeAttribute("hidden");
      changeMade = true;
    } 

    if (changeMade) {
      this.inkBlock.scroll(0, this.inkBlock.scrollHeight);
    }
  }

  /**
   * Returns the rendered source of a passage by name.
   */
  include (name: string): HTMLTemplateElement {
    // Search for passage by name.
    const passage = this.getPassageByName(name);

    // Does this passage exist?
    if (passage === null) {
      // It does not exist.
      // Throw error.
      throw new Error('There is no passage with name ' + name);
    }

    // Get passage source.
    let passageSource = passage.renderStaticElements();

    // Return the passage source.
    return passageSource;
  }

  /**
   * Render a passage to any/all element(s) matching query selector
   */
  renderPassageToSelector (passageName: string, selector: string) {
    // Get passage source
    const passageTemplate = this.include(passageName);

    // Replace the HTML of the selector (if valid).
    let element = this.workingPassage.querySelector(selector);
    if (element) {
      element.innerHTML = "";
      element.appendChild(passageTemplate.content.cloneNode(true));
    }
  }

  /**
   * Render a default passage to any/all element(s) matching query selector
   */
  renderDefaultPassageToSelector (tag: string, passageName: string, selector: string) {
    // Search for passage by name.
    const passage = this.getPassageByName(passageName, tag);

    // Does this passage exist?
    if (passage === null) {
      // It does not exist.
      // Throw error.
      throw new Error('There is no passage with name ' + name);
    }

    // Get passage source.
    let passageTemplate = passage.renderStaticElements();

    // Replace the HTML of the selector (if valid).
    let element = this.workingPassage.querySelector(selector);
    if (element) {
      element.innerHTML = "";
      element.appendChild(passageTemplate.content.cloneNode(true));
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
