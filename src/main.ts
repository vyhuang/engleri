import { Story } from './story/Story';
import { parse } from './grammar/passage';

declare global {
    interface Window {
        _story: any;
    }
}

// Create new Story instance.
window._story = new Story();
// Start story.
window._story.start();
console.log(parse("3 * (3 - 1)"));
