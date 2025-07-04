// Require Story.
const Story = require('./Story.js');
// Create new Story instance.
window.Story = new Story();
// Create global store shortcut.
window.s = window.Story.store;
// Start story.
window.Story.start();
