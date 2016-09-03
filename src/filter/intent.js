import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

function createEnterInputStream(inputElement, error$) {
    return Observable
        .fromEvent(inputElement, 'keypress')
        .filter(e => e.key === 'Enter')
        .filter(() => {
            const isFilterInput = !!location.search;

            if (isFilterInput === false) {
                error$.next('Oops, you did not set a filter to save.');
            }

            return isFilterInput;
        })
        .filter(e => e.target.value.trim() !== '')
        .do(e => {
            e.preventDefault();
            e.stopPropagation();
        })
        .map(e => {
            const { value } = e.target;
            e.target.value = '';
            return value;
        });
}

function createClickDeleteStream(selectElement) {
    return Observable
        .fromEvent(selectElement, 'click')
        .filter(({ target }) => {
            return target.classList.contains('gfe--deleteBtn')
                || target.parentNode.classList.contains('gfe--deleteBtn');
        })
        .do(e => {
            e.preventDefault();
            e.stopPropagation();
        })
        .map(({ target }) => {
            return target.getAttribute('data-name')
                || target.parentNode.getAttribute('data-name');
        });
}

function intent({ element }) {
    const { inputElement, selectElement } = element;
    const error$ = new Subject();

    return {
        enterInput$: createEnterInputStream(inputElement, error$),
        clickDelBtn$: createClickDeleteStream(selectElement),
        error$
    }
}

export default intent;