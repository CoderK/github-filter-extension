import intent from './intent';
import model from './model';
import view from './view';

require("./css/gfe.css");

function main(props) {
    const actions = intent(props);
    const state$ = model(actions, props);
    const dom$ = view(state$, props);

    actions.error$.subscribe(msg => alert(msg));

    return {
        DOM: dom$
    }
}

export default main;
