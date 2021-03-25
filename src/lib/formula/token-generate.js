import {deepClone} from "../../utils/index";
import {const_token, empty_token, field_token, func_token, input_token, arithmetic_token, operator_token} from "../../config/define-token";
import func_type from "../../config/function-types";
import fmlI18n from "i18next";

function GenerateToken() {
    this.funcTokens = [];
    this.arithmeticToken = arithmetic_token;
    this.operatorTokens = operator_token;
    this.constTokens = [];
    this.fieldTokens = [];
    this.funcTypes = {};
    this.inputToken = input_token;
    this.empty_token = empty_token;

    this.funcTokenObj = {};
    this.constTokenObj = {};
}

GenerateToken.prototype.generateToken = function (options) {
    this.generateFuncType();
    this.generateFuncTokens(options);
    this.translatePlaceholder();
    this.generateFieldTokens(options.fields);
    this.generateConstTokens();
};

GenerateToken.prototype.generateFuncType = function () {
    Object.keys(func_type).forEach(key => {
        func_type[key].forEach(item => {
            item.classification = key;
        });
    });
    Object.values(func_type).forEach(arr => {
        arr.forEach(item => {
            this.funcTypes[item.name] = item;
        });
    });
};

GenerateToken.prototype.generateFuncTokens = function (options) {
    let originTypes = deepClone(Object.values(this.funcTypes));
    let otherTypes = [];
    if (options.defineFunctions) {
        otherTypes = deepClone(options.defineFunctions);
    }
    let mergeTypes = this.mergeFuncTypes(originTypes, otherTypes);
    this.funcTokens = this.generateFuncToken(mergeTypes);
};

GenerateToken.prototype.generateFieldTokens = function (arr) {
    let cloneArr = deepClone(arr);
    initValue(cloneArr);
    function initValue(list) {
        list.forEach(item => {
            item.token = field_token.token;
            if (item.child && item.child.length > 0) {
                initValue(item.child);
            }
        });
    }
    this.fieldTokens = cloneArr;
};

GenerateToken.prototype.mergeFuncTypes = function (originTypes, otherTypes) {
    const result = [];
    const originName = [];
    const otherName = [];
    const newFuncName = [];
    const changeFuncName = [];
    const changeFunc = [];

    originTypes.map(item => {
        originName.push(item.name);
    });
    otherTypes.map(item => {
        otherName.push(item.name);
    });
    otherName.map(item => {
        if (!originName.includes(item)) {
            newFuncName.push(item);
        } else {
            changeFuncName.push(item);
        }
    });

    otherTypes.map(item => {
        if (changeFuncName.includes(item.name)) {
            changeFunc.push(item);
        }
        if (newFuncName.includes(item.name)) {
            originTypes.push(item);
        }
    });

    originTypes.forEach(i => {
        changeFunc.forEach(j => {
            if (i.name === j.name) {
                i = {...i, ...j};
            }
        });
        result.push(i);
    });
    return result;
};

// 根据预定义和用户传入的参数生成最终的funcToken
GenerateToken.prototype.generateFuncToken = function (arr) {
    const result = [];
    arr.map(item => {
        const {name, desc, params, ...rest} = item;
        let o = deepClone({
            ...func_token,
            ...{
                name,
                desc,
                placeholder: generatePlaceholder(params),
                params: generateParam(params),
                limitParameterLength: item.limitParameterLength,
                minParameterLength: params.length,
                extra: rest
            }
        });
        result.push(o);
        this.funcTokenObj[name] = o;
    });

    function generateParam(params) {
        let arr = [];
        params.forEach(() => {
            arr.push({...empty_token});
        });
        return arr;
    }

    function generatePlaceholder(params) {
        let arr = [];
        params.forEach(item => {
            arr.push(item);
        });
        return arr;
    }

    return result;
};

GenerateToken.prototype.generateConstTokens = function () {
    const result = [];
    Object.values(const_token).forEach(item => {
        const {token, value, ...rest} = item;
        const obj = {
            token,
            value,
            name: value
        };
        this.constTokenObj[obj.name] = obj;
        result.push(obj);
    });
    this.constTokens = result;
};

GenerateToken.prototype.resetPlaceholder = function (parent) {
    if (this.funcTokenObj[parent.name]) {
        if (!parent.placeholder) parent.placeholder = [];
        this.funcTokenObj[parent.name].placeholder.forEach((item, idx) => {
            parent.placeholder[idx] = item;
        });
    }
};

GenerateToken.prototype.translatePlaceholder = function () {
    Object.entries(this.funcTokenObj).forEach(([key, value]) => {
        value.desc.intro = fmlI18n.t(`${key.toLowerCase()}Intro`);
        value.desc.parameters.forEach((item, idx) => {
            value.desc.parameters[idx] = fmlI18n.t(`${key.toLowerCase()}Params${idx + 1}`);
        });
    });
};

export default GenerateToken;
