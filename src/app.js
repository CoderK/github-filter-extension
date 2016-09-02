import $ from 'jquery/dist/jquery.slim';
import clone from 'lodash/clone';
import template from 'lodash/template';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import DeepDiff from 'deep-diff';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/mergeMap';

function readyElements(el, templates) {
    const $select = $(".subnav-spacer-right .select-menu-list", el);
    return {
        $input: injectInputform($select, templates),
        $select
    }
}

function readyTemplates() {
    return {
        tplItem: `<a id="<%= name %>" href="<%= path %>" class="select-menu-item js-navigation-item gfe--filterItem">
                            <div class="select-menu-item-text" style="float:left;"><%= name %></div>
                            <svg
                              data-name="<%= name %>"
                              aria-hidden="true"
                              class="octicon octicon-link-external select-menu-item-icon gfe--deleteBtn"
                              height="16"
                              version="1.1"
                              viewBox="0 0 12 16"
                              width="16">
                            <path d="M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z"></path>
                          </svg>
                        </a>`,
        tplInput: `<a id='__filterInputWrap' class="select-menu-item" target="_blank">
                            <div class="select-menu-item-text">
                                <input class='gfe--input' type='text' placeholder="Enter name to save" maxlength="15">
                            </div>
                          </a>`
    }
}

function createProps(el) {
    const template = readyTemplates();
    return {
        template,
        element: readyElements(el, template),
        projectKey: `gfx:${location.pathname}`
    }
}

function intent({ element }) {
    const { $input, $select } = element;

    const error$ = new Subject();
    const enterInput$ = Observable
        .fromEvent($input, 'keypress')
        .filter(e => e.key === 'Enter')
        .filter(() => {
            const isFilterInput = !!location.search;

            if (isFilterInput === false) {
                error$.next('Oops, you did not set a filter to save.');
            }

            return isFilterInput;
        })
        .filter(e => $.trim(e.target.value) !== '')
        .do(e => {
            e.preventDefault();
            e.stopPropagation();
        })
        .map(e => {
            const { value } = e.target;
            e.target.value = '';
            return value;
        });
    const clickDelBtn$ = Observable
        .fromEvent($select, 'click')
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

    return {
        enterInput$,
        clickDelBtn$,
        error$
    }
}

function model(actions$, { projectKey }) {
    const initState = JSON.parse(localStorage.getItem(projectKey)) || [];
    const { enterInput$, clickDelBtn$, error$ } = actions$;

    const reducers$ = Observable
        .merge(
            enterInput$.map(inputValue => {
                return (state) => {
                    if (findIndex(state, item => inputValue === item.name) > -1) {
                        error$.next('Oops, Already exists!!');
                        return state;
                    }

                    const newState = clone(state);
                    newState.push({ name: inputValue, path: location.href });
                    return newState;
                };
            }),
            clickDelBtn$.map(id => {
                return (state) => {
                    return filter(state, item => item.name !== id);
                };
            })
        );

    return Observable
        .of(initState)
        .merge(reducers$)
        .scan((state, reducer) => reducer(state))
        .do(state => localStorage.setItem(projectKey, JSON.stringify(state)))
        .startWith([]);
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

function updateItem(path, rhs) {
    const [ idx, key ] = path;
    const $target = $('.gfe--filterItem').eq(idx);

    if (key === 'name') {
        $target.find('.select-menu-item-text').text(rhs);
        $target.find('svg').attr('data-name', rhs);
        $target.attr('id', rhs);
    } else if (key === 'path') {
        $target.attr('href', rhs);
    }
}

function removeItem(name) {
    $(`#${name}`).remove();
}

function patch(diff, element, template) {
    const { kind, item, rhs, lhs, path } = diff;
    const { $input } = element;
    const { tplItem } = template;

    if(kind === 'N') {
        prependItem(tplItem, $input, rhs);
    } else if(kind === 'A') {
        patch(item, element, template);
    } else if(kind === 'E') {
        updateItem(path, rhs);
    } else if(kind === 'D') {
        removeItem(lhs.name);
    }
}

function prependItem(tplItem, $target, data) {
    const itemHtml = template(tplItem)(data);
    $target.before(itemHtml);
}

function main(props) {
    const actions = intent(props);
    const state$ = model(actions, props);
    const dom$ = view(state$, props);

    actions.error$.subscribe(msg => alert(msg));

    return {
        DOM: dom$
    }
}

function run(main, el) {
    if (isOnInvalidPath()) {
        return;
    }

    if (document.getElementById('__filterInputWrap')) {
        return;
    }

    const props = createProps(el);
    const { DOM } = main(props);

    DOM.subscribe();
}

function injectInputform($select, { tplInput }) {
    const $input = $(tplInput);
    $select.children().last().before($input);
    return $input;
}

function isOnInvalidPath() {
    const pathname = location.pathname;
    const firstLinkHref = document.querySelector('link').href;

    const isNotGithubPage = /^(https:\/\/).*\/assets\/frameworks\-.*/.test(firstLinkHref) === false;
    const hasNoFilterOnPage = /(.*)\/(.*)\/(issues|pulls)/.test(pathname) === false;

    return isNotGithubPage || hasNoFilterOnPage;
}

$(document).ready(() => {
    const runner = run.bind(null, main, document);
    chrome.extension.onMessage.addListener(runner);
    runner.call(this);
});