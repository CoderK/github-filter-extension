function injectInputform(selectNode, { tplInput }) {
    const childNods = selectNode.children;
    const lastIdx = childNods.length - 1;

    childNods[lastIdx].insertAdjacentHTML('beforebegin', tplInput);

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

export default function createProps(el) {
    const template = readyTemplates();
    return {
        template,
        element: readyElements(el, template),
        projectKey: `gfx:${location.pathname}`
    }
}