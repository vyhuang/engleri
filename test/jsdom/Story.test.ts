/* The MIT License (MIT) Copyright (c) 2019 Chris Klimas, 2022 Dan Cox, 2025 Vincent H.*/

import { Story } from '../../src/story/Story';

describe('Story', () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
      <tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata>
      <tw-passagedata pid="2" name="Test Passage 2" tags="tag2">Hello world 2</tw-passagedata>
      <tw-passagedata pid="3" name="Test Passage 3" tags="">
        \n&lt;==html==&gt;\n
          <div><p><span>Test</span><p></div>
        \n&lt;==&gt;
      </tw-passagedata>
      <tw-passagedata pid="4" name="Test Passage 4" tags=""></tw-passagedata>
      <tw-passagedata pid="5" name="Test Passage 5" tags="">[[Test Passage]]</tw-passagedata>
      <script type="text/twine-javascript">window.scriptRan = true;</script>
      <style type="text/twine-css">body { color: blue }</style>
   </tw-storydata>
   <tw-story>
    <tw-storydefaults tags="ink_block" name="basic_ink_block">
      \n&lt;==html==&gt;
      \\<!-- Styling for the ink block -->
      \\<div id="ink_content">
        <p id="content_template" hidden="hidden">{content}</p>
      \\</div>
      \\<div id="ink_choices" hidden="hidden">
        <a id="choice_template" class="ink_choice" choiceindex="{choiceIndex}" href="javascript:void(0)" hidden="hidden">
          {choiceIndex}. {choiceText}
        </a>
      \\</div>
      \\<div id="tap_reminder" hidden="hidden">
        (Click or Tap)
      \\</div>
      \n&lt;==&gt;
    </tw-storydefaults>
    <tw-sidebar>
        <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
        <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
      </tw-sidebar>
    <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`;

    // Create new Story instance.
    window._story = new Story();
    // Start story.
    window._story.start();
  });

  describe('constructor()', () => {
    it('Should record all passages', () => {
      expect(window._story.passages.length).toBe(5);
    });
  });

  describe('include()', () => {
    it('Should include a passage by name', () => {
      expect(window._story.include('Test Passage').innerHTML).toBe('<p>Hello world</p>\n');
    });

    it('Should throw error when name is not found in passages', () => {
      expect(() => { window._story.include('Not Found'); }).toThrow();
    });
  });

  describe('getPassageByTag()', () => {
    it('Should return empty array if tag does not exist in story', () => {
      expect(window._story.getPassagesByTag('tag3').length).toBe(0);
    });

    it('Should return array of one entry if tag is only used once', () => {
      expect(window._story.getPassagesByTag('tag1').length).toBe(1);
    });

    it('Should return array of two entry if tag is used twice', () => {
      expect(window._story.getPassagesByTag('tag2').length).toBe(2);
    });
  });

  describe('getPassageByName()', () => {
    it('Should return null if passage name does not exist', () => {
      expect(window._story.getPassageByName('Nope')).toBe(null);
    });

    it('Should return passage if name exists', () => {
      const p = window._story.getPassageByName('Test Passage 3');
      expect(p.name).toBe('Test Passage 3');
    });
  });

  describe('include()', () => {
    it('Should return template of named passage', () => {
      expect(window._story.include('Test Passage 5').innerHTML)
        .toEqual('<p><tw-link data-passage="Test Passage">Test Passage</tw-link></p>\n');
    });

    it('Should throw error if named passage does not exist', () => {
      expect(() => window._story.include('Test Passage 10')).toThrow();
    });
  });

  describe('renderPassageToSelector()', () => {
    it('Should render to a selector', () => {
      window._story.renderPassageToSelector('Test Passage', 'tw-passage');
      expect(document.querySelector('tw-passage').innerHTML).toBe('<p>Hello world</p>\n');
    });

    it('Should throw error if passage does not exist', () => {
      expect(() => window._story.renderPassageToSelector(':yeah', '<test>')).toThrow();
    });
  });

  describe('start()', () => {
    /*
    it('Should add story styles with start()', () => {
      window._story.start();
      const storyStyles = document.querySelectorAll('style');
      expect(storyStyles.length).toBe(3);
    });
    */

    /*
    it('Should run story scripts with start()', () => {
      window.scriptRan = false;
      window._story.start();
      expect(window.scriptRan).toBe(true);
    });
    */

    it('Should throw error if starting passage cannot be found', () => {
      document.body.innerHTML = `
        <tw-storydata name="Test" startnode="3" creator="jasmine" creator-version="1.2.3">
          <tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata>
          <script type="text/twine-javascript"></script>
          <style type="text/twine-css"></style>
      </tw-storydata>
      <tw-story>
        <tw-storydefaults tags="ink_block" name="basic_ink_block">
          \n&lt;==html==&gt;
          \\<!-- Styling for the ink block -->
          \\<div id="ink_content">
            <p id="content_template" hidden="hidden">{content}</p>
          \\</div>
          \\<div id="ink_choices" hidden="hidden">
            <a id="choice_template" class="ink_choice" choiceindex="{choiceIndex}" href="javascript:void(0)" hidden="hidden">
              {choiceIndex}. {choiceText}
            </a>
          \\</div>
          \\<div id="tap_reminder" hidden="hidden">
            (Click or Tap)
          \\</div>
          \n&lt;==&gt;
        </tw-storydefaults>
        <tw-sidebar>
          <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
          <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
        </tw-sidebar>
        <tw-passage class="passage" aria-live="polite"></tw-passage>
      </tw-story>`;

      // Create new Story instance
      window._story = new Story();

      // Create global store shortcut.
      //window.s = window._story.store;

      // The starting passage does not exist.
      // This will throw an error.
      expect(() => { window._story.start(); }).toThrow();
    });
  });

  describe('show()', () => {
    it('Should replace the current passage content', () => {
      window._story.show('Test Passage');
      expect(document.querySelector('tw-passage').innerHTML).toBe('<p>Hello world</p>\n');
    });

    it('Should throw error if passage does not exist', () => {
      expect(() => window._story.show('Nope')).toThrow();
    });

    /*
    it('Should emit show event', () => {
      let result = false;
      State.events.on('show', async () => {
        result = true;
        await expect(result).toBe(true);
      });
      window._story.show('Test Passage');
    });
    */
  });

  describe('goto()', () => {
    it('Should replace the current passage content', () => {
      window._story.goto('Test Passage');
      expect(document.querySelector('tw-passage').textContent).toBe('Hello world\n');
    });

    it('Should throw error if passage does not exist', () => {
      expect(() => window._story.goto('Nope')).toThrow();
    });

    it('Should assume default values', () => {
      expect(() => window._story.goto()).toThrow();
    });

    /*
    it('Should emit show event', () => {
      let result = false;
      State.events.on('show', async () => {
        result = true;
        await expect(result).toBe(true);
      });
      window._story.goto('Test Passage');
    });
    */
  });

  describe('addPassage()', () => {
    it('Should add a new passage and increase length of passage array', () => {
      const currentLength = window._story.passages.length;
      window._story.addPassage('Example');
      expect(window._story.passages.length).toBe(currentLength + 1);
    });

    it('Should throw error if passage name already exists', () => {
      window._story.addPassage('Example');
      expect(() => { window._story.addPassage('Example'); }).toThrow();
    });

    it('Should ignore non-array data for tags', () => {
      window._story.addPassage('Example', 'test');
      const passage = window._story.getPassageByName('Example');
      expect(passage.tags.length).toBe(0);
    });

    it('Should ignore non-string data for source', () => {
      window._story.addPassage('Example', [], null);
      const passage = window._story.getPassageByName('Example');
      expect(passage.source.length).toBe(0);
    });

    it('Should assume default values', () => {
      window._story.addPassage();
      const passage = window._story.getPassageByName('');
      expect(passage.name).toBe('');
      expect(passage.tags.length).toBe(0);
      expect(passage.source).toBe('');
    });
  });

  describe('removePassage()', () => {
    it('Should do nothing if passage does not exist', () => {
      const passageCount = window._story.passages.length;
      window._story.removePassage('Nah');
      expect(window._story.passages.length).toBe(passageCount);
    });

    it('Should remove passage by name', () => {
      window._story.removePassage('Test Passage 5');
      expect(window._story.getPassageByName('Test Passage 5')).toBe(null);
    });

    it('Should assume default value', () => {
      const passageCount = window._story.passages.length;
      window._story.removePassage();
      expect(window._story.passages.length).toBe(passageCount);
    });
  });
});

describe('Story Navigation', () => {
  beforeEach(() => {
    /*
     * :hidden and :visible will never work in JSDOM.
     * Solution via https://github.com/jsdom/jsdom/issues/1048
     */
    // @ts-ignore
    window.Element.prototype.getClientRects = function () {
      let node = this;
      while (node) {
        if (node === document) {
          break;
        }
        if (!node.style || node.style.display === 'none' || node.style.visibility === 'hidden') {
          return [];
        }
        node = node.parentNode;
      }
      return [{ width: 10, height: 10 }];
    };

    document.body.innerHTML = `
    <tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
      <tw-passagedata pid="1" name="Test Passage" tags="">[[Test Passage 2]]</tw-passagedata>
      <tw-passagedata pid="2" name="Test Passage 2" tags="">Hello world 2</tw-passagedata>
      <tw-passagedata pid="3" name="Test Passage 3" tags="">[[Test Passage]]</tw-passagedata>
      <script type="text/twine-javascript"></script>
      <style type="text/twine-css"></style>
   </tw-storydata>
   <tw-story>
    <tw-storydefaults tags="ink_block" name="basic_ink_block">
      \n&lt;==html==&gt;
      \\<!-- Styling for the ink block -->
      \\<div id="ink_content">
        <p id="content_template" hidden="hidden">{content}</p>
      \\</div>
      \\<div id="ink_choices" hidden="hidden">
        <a id="choice_template" class="ink_choice" choiceindex="{choiceIndex}" href="javascript:void(0)" hidden="hidden">
          {choiceIndex}. {choiceText}
        </a>
      \\</div>
      \\<div id="tap_reminder" hidden="hidden">
        (Click or Tap)
      \\</div>
      \n&lt;==&gt;
    </tw-storydefaults>
    <tw-sidebar>
        <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
        <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
      </tw-sidebar>
    <tw-passage aria-live="polite"></tw-passage></tw-story>`;

    // Create new Story instance.
    window._story = new Story();

    // Start story.
    window._story.start();
  });

  it('Should replace content when reader clicks a story link', () => {
    trigger(document.querySelector('tw-link'), 'click');
    expect(document.querySelector('tw-passage').textContent).toBe('Hello world 2\n');
  });

  /*
  it('Should undo content after a navigation event by function call', () => {
    trigger(document.querySelector('tw-link'), 'click');
    window._story.sidebar.undo();
    expect(document.querySelector('tw-passage').textContent).toBe('Test Passage 2\n');
  });
  */
});

function trigger(el: any, eventType: string) {
  if (typeof eventType === 'string' && typeof el[eventType] === 'function') {
    el[eventType]();
  } else {
    const event =
      typeof eventType === 'string'
        ? new Event(eventType, {bubbles: true})
        : eventType;
    el.dispatchEvent(event);
  }
}
