"use strict";
exports.__esModule = true;
exports.createUseContext = void 0;
var React = require("react");
function createUseContext(Context) {
    return function () {
        var context = React.useContext(Context);
        if (!context) {
            throw new Error("unknown context ".concat(Context.displayName));
        }
        return context;
    };
}
exports.createUseContext = createUseContext;
