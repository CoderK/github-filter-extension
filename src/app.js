import { main, createProps } from './filter/index';

function isOnInvalidPath() {
    const pathname = location.pathname;
    const firstLinkHref = document.querySelector('link').href;

    const isNotGithubPage = /^(https:\/\/).*\/assets\/frameworks\-.*/.test(firstLinkHref) === false;
    const hasNoFilterOnPage = /(.*)\/(.*)\/(issues|pulls)/.test(pathname) === false;

    return isNotGithubPage || hasNoFilterOnPage;
}

function isAlreadyInitialized() {
    return document.getElementById('__filterInputWrap') !== null;
}

function run(main, el) {
    if (isOnInvalidPath() || isAlreadyInitialized()) {
        return;
    }

    const props = createProps(el);
    const { DOM } = main(props);

    DOM.subscribe();
}

;(function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
})(() => {
    const runner = run.bind(null, main, document);
    chrome.extension.onMessage.addListener(runner);
    runner.call(this);
});