import { Story } from './Story';

declare global {
    interface Window {
        _story: any;
    }
}

// Create new Story instance.
window._story = new Story();
// Start story.
window._story.start();
