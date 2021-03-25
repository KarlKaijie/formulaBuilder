import {deepClone} from "../../utils";
import Token from "./token";
import FuncToken from "./token-func";
import GenerateToken from "./token-generate";
import ArithToken from "./token-arithmetic";
import {parameterTokens} from "../../config/define-token";

const output_fml_keys = ["name", "params", "value", "token", "paramTokens", "operator", 'type'];

function Fml(Bus) {
    Token.call(this);
    FuncToken.call(this);
    GenerateToken.call(this);
    ArithToken.call(this);
    this.Bus = Bus;
    this.formula = [];
    this.currentToken = {};
    this.emptyTokenId = [];
}

Fml.prototype = Object.assign(Token.prototype, FuncToken.prototype, GenerateToken.prototype, ArithToken.prototype);

Fml.prototype.getValue = function () {
    if (!this.formula) {
        return {
            type: "InvalidParams",
            value: null
        };
    }
    let cacheData = deepClone(this.formula);

    let valid = this.validParams(cacheData);
    if (!valid) {
        return {
            type: "InvalidParams",
            value: null
        };
    } else {
        this.deleteExtraParams(cacheData);
        return {
            type: "success",
            value: cacheData[0]
        };
    }
};

Fml.prototype.deleteExtraParams = function (info) {
    info.forEach(item => {
        Object.keys(item).forEach(i => {
            if (!output_fml_keys.includes(i)) {
                delete item[i];
            }
        });
        if (item.params && item.params.length > 0) {
            this.deleteExtraParams(item.params);
        }
    });
};

Fml.prototype.validParams = function (info, flag) {
    let valid = true;
    if (info && info.length === 0) valid = false;
    validate(info, flag);

    function validate(info, flag) {
        info.forEach(item => {
            if (parameterTokens.includes(item.token) && !item.value) {
                if (valid) valid = false;
            }
            if (item.params && item.params.length === 0) {
                valid = false;
            }
            if (item.params && item.params.length > 0) {
                validate(item.params, flag);
            }
        });
    }
    return valid;
};

Fml.prototype.initInitialValue = function (info) {
    let that = this;
    if (info && Object.prototype.toString.call(info) === "[object Object]" && JSON.stringify(info) !== "{}") {
        this.currentToken = {};
        let initialData = deepClone([info]);
        this.updateId(initialData);
        initExtraInfo(initialData);
        this.formula = initialData;
        this.emitTokenUpdated();

        function initExtraInfo(arr) {
            arr.forEach(item => {
                if (item.params && item.params.length > 0) {
                    if(that.funcTokenObj && that.funcTokenObj[item.name] && that.funcTokenObj[item.name].limitParameterLength) {
                        item.limitParameterLength = that.funcTokenObj[item.name].limitParameterLength
                        item.minParameterLength = that.funcTokenObj[item.name].params.length
                    }
                    that.resetPlaceholder(item);
                    initExtraInfo(item.params);
                }
            });
        }
    }
};

Fml.prototype.clear = function () {
    this.formula = [];
    this.currentToken = {};
    this.emitTokenUpdated();
};

Fml.prototype.parseTree2ExcelFormula = function() {
    const value = this.getValue()
    if(value.type !== 'success') return;
    const formula = value.value
    console.log(formula);

}

export default Fml;
