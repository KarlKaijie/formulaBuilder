/**
 * function token 类
 */

import {deepClone} from "../../utils";

function FuncToken() {}

// wrapFuncToken
FuncToken.prototype.wrapFuncToken = function (info) {
    if (this.currentToken && this.currentToken.token) {
        this.mergeFuncToken(this.currentToken, info.name);
        this.emitTokenUpdated();
    } else if (!this.currentToken.token && this.formula.length > 0) {
    } else {
        let result = [info];
        this.updateId(result);
        this.formula = deepClone(result);
        this.currentToken = this.formula[0].params[0];
        this.findNext();
        this.emitTokenUpdated();
    }
};

// mergeFuncToken
FuncToken.prototype.mergeFuncToken = function (firstParam, funcName) {
    let targetFunc = null;
    this.funcTokens.map(item => {
        if (item.name === funcName) {
            targetFunc = deepClone(item);
        }
    });
    if (!targetFunc) return;
    let rplObj = null;

    let tgParent = this.findTargetToken(this.formula, firstParam.parentUniqueId, "uniqueId");
    if (tgParent) {
        let idx = tgParent.params.findIndex(item => item.uniqueId === this.currentToken.uniqueId);
        if (idx < 0) return;

        rplObj = this.mergeFuncParams(targetFunc);
        tgParent.params.splice(idx, 1, rplObj);
    } else if (this.currentToken.parentId === 0) {
        rplObj = this.mergeFuncParams(targetFunc);
        this.formula = [rplObj];
    }
    this.updateId(this.formula);
    if (rplObj) this.currentToken = rplObj.params[0];
    this.findNext();
};

FuncToken.prototype.mergeFuncParams = function (targetFunc) {
    let firstParams = deepClone(this.currentToken);
    targetFunc.params.splice(0, 1, firstParams);
    return targetFunc;
};

FuncToken.prototype.addEmptyToken = function (info) {
    let parent = this.findTargetToken(this.formula, info.uniqueId, "uniqueId");
    if (parent) {
        this.addMethod(this.formula, info.uniqueId, parent);
        this.findNext();
        this.emitTokenUpdated();
    }
};

FuncToken.prototype.addMethod = function (arr, uniqueId, parent) {
    this.id++;
    this.uniqueId++;
    parent.params.push({
        token: "empty",
        value: null,
        id: this.id,
        level: parent.level + 1,
        parentLevel: parent.level,
        parentId: parent.id,
        uniqueId: this.uniqueId,
        parentUniqueId: parent.uniqueId
    });

    let newPlaceholder = "";
    if (parent && parent.placeholder) {
        if (parent.extra.newPlaceholder === "number") {
            newPlaceholder = "number" + parent.params.length;
            parent.placeholder.push(newPlaceholder);
        } else {
            newPlaceholder = parent.extra.newPlaceholder || "";
            parent.placeholder.push(newPlaceholder);
        }
    }
    this.updateId(this.formula);
    this.currentToken = this.findTargetToken(arr, this.uniqueId, "uniqueId");
};

FuncToken.prototype.setFuncIntro = function (info) {
    this.formulaIntro = info.desc;
    this.emitFuncIntro();
};

FuncToken.prototype.emitFuncIntro = function () {
    this.Bus.$emit("updateIntro", {intro: this.formulaIntro});
};

export default FuncToken;
