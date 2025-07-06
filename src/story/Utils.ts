/* The MIT License (MIT) Copyright (c) 2025 Vincent H. */

class Utils {
    static generateElements(html : string) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.children;
    }

    static addEventListener(eventName : string, eventHandler: (e: Event) => void, selector : string) {
        const wrappedHandler = (e: Event) => {
            if (!e.target || !(e.target instanceof Element)) return;
            const el = e.target.closest(selector);
            if (el) {
                eventHandler.call(el, e);
            }
        };
        document.addEventListener(eventName, wrappedHandler);
        return wrappedHandler;
    }
}

export { Utils };
