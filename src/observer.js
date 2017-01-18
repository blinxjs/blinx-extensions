import Observa from "observa";

let _callObservingMethods = function (...args) {
    let ctx = this;

    setTimeout(() => {
        ctx.__observerFns.forEach((fnObj) => {
            if (Array.isArray(fnObj.deps)) {

                // Dont trigger if adjacent node/sibling node has changed
                let pathArray = path.split("=");
                let depsMatched = fnObj.deps.find((deps) => {
                    let depsArr = deps.split(".");

                    if (isEqual(depsArr, pathArray)) return true;

                    if (pathArray.length < depsArr.length) {
                        let pathLastIndex = pathArray.length - 1;

                        if (isEqual(pathArray[pathLastIndex], depsArr[pathLastIndex])) return true;
                    }

                    if (pathArray.length <= depsArr.length) {
                        return pathArray.find((keyItem, index) => {
                            return depsArr[index] !== keyItem;
                        });
                    }
                });

                depsMatched ? fnObj.fn.call(ctx) : undefined;
            } else {
                fnObj.fn.call(ctx, ...args);
            }
        });
    });
};


export default function (module) {
    let $ = Observa({
        _: {}
    });

    // Observable proxy setup
    module.__observerFns = [];
    module.observe_For && module.observe_For.forEach((fnName)=> {
        if (!module[fnName] || typeof module[fnName] !== "function") {
            console.error(`{fnName} is not available over module. Can be observed.`)
            return;
        }
        let fnObj = {
            fn: module[fnName],
            deps: "*"
        };

        module.__observerFns.push(fnObj);
    });

    $.onChange = function (...args) {
        console.log("Onchange called....");
        console.log(arguments);
        _callObservingMethods.call(module, ...args);
    };

    return {
        _: $._
    }
};