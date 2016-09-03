import clone from 'lodash/clone';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/scan';

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

export default model;