import DeepDiff from 'deep-diff';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

function updateItem(path, rhs) {
    const [ idx, key ] = path;
    const targetElement = document.getElementsByClassName('gfe--filterItem')[idx];

    if (key === 'name') {
        targetElement.querySelector('.select-menu-item-text').textContent = rhs;
        targetElement.querySelector('svg').setAttribute('data-name', rhs);
        targetElement.id = rhs;
    } else if (key === 'path') {
        targetElement.href = rhs;
    }
}

function removeItem(name) {
    const targetNode = document.getElementById(name);
    targetNode.parentNode.removeChild(targetNode);
}

function patch(diff, element, template) {
    const { kind, item, rhs, lhs, path } = diff;
    const { inputElement } = element;
    const { tplItem } = template;

    if(kind === 'N') {
        prependItem(tplItem, inputElement, rhs);
    } else if(kind === 'A') {
        patch(item, element, template);
    } else if(kind === 'E') {
        updateItem(path, rhs);
    } else if(kind === 'D') {
        removeItem(lhs.name);
    }
}

function prependItem(tplItem, targetElement, data) {
    const itemHtml = tplItem(data);
    targetElement.insertAdjacentHTML('beforebegin', itemHtml);
}

function view(state$, { element, template }) {
    return state$
        .pairwise()
        .map(([ beforeState, afterState ]) => {
            return DeepDiff.diff(beforeState, afterState) || [];
        })
        .flatMap(diffs => diffs)
        .do(diff => patch(diff, element, template));
}

export default view;