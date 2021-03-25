import {deepClone} from "../../utils";
import {arithmetic_token} from "../../config/define-token";

function ArithToken() {}

// addArithToken
ArithToken.prototype.addArithToken = function (info) {
    let tgParent = this.findTargetToken(this.formula, this.currentToken.parentUniqueId, "uniqueId");
    let rplObj = deepClone(arithmetic_token);
    rplObj.operator = info.operator;
    rplObj.type = info.value;
    if (tgParent) {
        rplObj.params.splice(0, 1, deepClone(this.currentToken));
        let idx = tgParent.params.findIndex(item => item.uniqueId === this.currentToken.uniqueId);
        if (idx < 0) return;
        clearTopTag(rplObj.params);
        tgParent.params.splice(idx, 1, rplObj);
        this.updateId(this.formula);
        this.currentToken = rplObj;
        this.findNext();
        this.emitTokenUpdated();
        return;
    }
    //
    if (this.formula.length === 0) {
        rplObj.isArithTop = true;
        this.formula.push(rplObj);
        this.updateId(this.formula);
        this.currentToken = rplObj;
        this.findNext();
        this.emitTokenUpdated();
        return;
    }
    //
    if (this.currentToken && ["field", "input", "const_token", "function", "arithmetic_token"].includes(this.currentToken.token)) {
        rplObj.params.splice(0, 1, this.currentToken);
        rplObj.isArithTop = true;
        this.formula = [rplObj];
        clearTopTag(rplObj.params);
        this.updateId(this.formula);
        this.currentToken = rplObj;
        this.findNext();
        this.emitTokenUpdated();
    }

    function clearTopTag(arr) {
        arr.forEach(item => {
            if (item.isArithTop) delete item.isArithTop;
            if (item.params && item.params.length > 0) {
                clearTopTag(item.params);
            }
        });
    }
};

export default ArithToken;
