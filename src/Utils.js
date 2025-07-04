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

module.exports = Utils;
