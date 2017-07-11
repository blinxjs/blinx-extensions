import setDom from "set-dom";

export default function (module) {
    if (!module.config || !module.config.enableSmartRender) return {};

    let renderFn = function (eventName) {

        let placeholder = this._;

        if (this.config.smartRenderModelKey) {
            placeholder = this._[this.config.smartRenderModelKey];
        }

        let parentNode = document.querySelector(`#${this.getUniqueId()}`);
        let hasChild = parentNode.firstChild;

        if (!hasChild) {
            parentNode.innerHTML = "<div></div>";
            hasChild = parentNode.firstChild;
        }

        setDom(hasChild, this.template(placeholder));

    };

    return {

        render: renderFn
    }
}