import tplItem from './templates/item.html';
import tplInput from './templates/input.html';

function injectInputform(selectNode, { tplInput }) {
    const childNods = selectNode.children;
    const lastIdx = childNods.length - 1;

    childNods[lastIdx].insertAdjacentHTML('beforebegin', tplInput());

    return selectNode.children[lastIdx];
}

function readyElements(el, templates) {
    const selectElement = el.querySelector('.subnav-spacer-right .select-menu-list');
    return {
        inputElement: injectInputform(selectElement, templates),
        selectElement
    }
}

function readyTemplates() {
    return {
        tplItem: tplItem,
        tplInput: tplInput
    }
}

export default function createProps(el) {
    const template = readyTemplates();
    return {
        template,
        element: readyElements(el, template),
        projectKey: `gfx:${location.pathname}`
    }
}