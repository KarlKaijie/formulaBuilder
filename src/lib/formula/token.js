/*
 * @Description: token基类
 * @Author: 张开杰_Karl
 * @Email: zhangkaijie163@gmail.com
 * @Date: 2021-01-28 11:20:41
 * @LastEditTime: 2021-03-25 09:49:23
 * @LastEditors: 张开杰_Karl
 */

import {parameterTokens} from "../../config/define-token";

function Token() {
    this.id = 1;
    this.uniqueId = 1;
}

Token.prototype.deleteToken = function (info) {
    if (!info.parent || info.parent.isTop || info.parent.isArithTop) {
        this.formula = [];
        this.currentToken = {};
    } else {
        this.deleteMethod(this.formula, info.child.uniqueId, info.parent);
        this.findNext();
    }
    this.emitTokenUpdated();
};

Token.prototype.resetToken = function (info) {
    if (!info.parent || info.parent.isTop) {
        this.formula = [];
        this.currentToken = {};
        this.emitTokenUpdated();
        return;
    }

    if (info.parent && info.child.token === "arithmetic_token" && info.parent.token === "arithmetic_token") {
        let parentParent = this.findTargetToken(this.formula, info.parent.parentUniqueId, "uniqueId");
        if (parentParent) {
            this.resetMethod(this.formula, info.parent.uniqueId, parentParent);
        }
        this.findNext();
        this.emitTokenUpdated();
        return;
    }

    this.resetMethod(this.formula, info.child.uniqueId, info.parent);
    this.updateId(this.formula);
    this.findNext();
    this.emitTokenUpdated();
};

Token.prototype.resetMethod = function (arr, uniqueId, parent) {
    this.id++;
    this.uniqueId++;
    arr.forEach((item, idx) => {
        if (item.uniqueId === uniqueId) {
            parent.params.splice(idx, 1, {
                token: "empty",
                value: null,
                id: this.id,
                level: parent.level + 1,
                parentLevel: parent.level,
                parentId: parent.id,
                uniqueId: this.uniqueId,
                parentUniqueId: parent.uniqueId,
                placeholder: this.resetPlaceholder(parent)
            });
        }
        if (item.params && item.params.length > 0) {
            this.resetMethod(item.params, uniqueId, parent);
        }
    });
};

Token.prototype.deleteMethod = function (arr, uniqueId, parent) {
    arr.forEach((item, idx) => {
        if (item.uniqueId === uniqueId) {
            parent.params.splice(idx, 1);
            this.resetPlaceholder(parent);
        }
        if (item.params && item.params.length > 0) {
            this.deleteMethod(item.params, uniqueId, parent);
        }
    });
};

Token.prototype.emptyValue = function (info) {
    let current = info.child;
    current.value = "";
    this.currentToken = current;
    this.emitTokenUpdated();
};

Token.prototype.updateId = function (arr, level = 1, parentId = 0, parentUniqueId = 0) {
    arr.forEach(item => {
        item.level = level;
        item.parentLevel = level - 1;
        item.parentId = parentId;
        item.id = this.id;
        item.uniqueId = item.uniqueId ? item.uniqueId : this.uniqueId;
        item.parentUniqueId = parentUniqueId;
        this.id++;
        this.uniqueId++;
        if (item.params && item.params.length > 0) {
            this.updateId(item.params, level + 1, this.id - 1, item.uniqueId);
        }
    });
};

Token.prototype.modifyValue = function (info, findNext = true) {
    if (this.formula.length === 0) {
        this.formula.push({
            token: info.token,
            value: info.value
        });
        this.updateId(this.formula);
        this.currentToken = this.formula[0];
        this.emitTokenUpdated();
    } else {
        if (!this.currentToken) return;
        if (this.currentToken.id < 0) return;
        let tg = this.findTargetToken(this.formula, this.currentToken.uniqueId, "uniqueId");
        if (!tg) return;
        if (!parameterTokens.includes(tg.token)) return;
        tg.value = info.value;
        tg.token = info.value ? info.token : 'empty';
    }
    findNext && this.findNext();
    this.emitTokenUpdated();
};

// notice
Token.prototype.emitTokenUpdated = function () {
    this.Bus.$emit("update", {
        formula: this.formula,
        currentToken: this.currentToken
    });
};

Token.prototype.setCurrentToken = function (info) {
    this.currentToken = info;
    this.emitTokenUpdated();
};

// find param or formula
Token.prototype.findTargetToken = function (arr, value, type) {
    let result = null;
    filterItem(arr, value, type);

    function filterItem(arr, value, type) {
        arr.forEach(item => {
            if (item[type] === value) {
                result = item;
            }
            if (item.params && item.params.length > 0) {
                filterItem(item.params, value, type);
            }
        });
    }

    return result;
};

// find next param
Token.prototype.findNext = function () {
    let that = this;
    this.emptyTokenId = [];
    let nextId = findNextMethod(this.formula);
    if (nextId) {
        this.currentToken = this.findTargetToken(this.formula, nextId, "id");
        return true;
    } else {
        return false;
    }

    function findNextMethod(arr) {
        arr.forEach(item => {
            if (item.params && item.params.length > 0) {
                findNextMethod(item.params);
            }
            if (!item.value && parameterTokens.includes(item.token)) {
                that.emptyTokenId.push(item.id);
            }
        });
        that.emptyTokenId.sort((a,b) => a-b);
        return that.emptyTokenId[0];
    }
};
export default Token;
